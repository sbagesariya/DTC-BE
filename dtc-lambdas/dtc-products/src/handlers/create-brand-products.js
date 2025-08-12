const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const Constants = require('../../utils/constants');
const CommonService = require('../../src/services/common.service');
const UUID = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * @name CreateBrandProducts class
 */
class CreateBrandProducts {
    /**
     * @desc This function is being used to to create product
     * @param {Object} req Request
     * @param {Object} req.body Body
     * @param {String} req.body.product_name Product name
     * @param {Object} req.body.product_images Product Images
     * @param {String} req.body.product_alcohol_type Product Alcohol Type
     * @param {String} req.body.product_description Product Description
     * @param {String} req.body.product_size_variants Product Size Variants
     */
    async createProducts (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            const variants = body.product_size_variants;
            delete (body.product_size_variants);
            body.search_product_name = (body.product_name).toLowerCase();
            if (body.product_id) {
                await this.deleteProductVariants(body);
                this.deleteS3File(body);
                this.updateProduct(body);
                this.updateSavedProduct(body);
                this.updateProductAddresses(body);
                this.updateSizeVariants(body);
                this.updateInventory(body, Constants.TABLE_INVENTOTY);
                this.updateInventory(body, Constants.TABLE_FC_INVENTORY);
                this.updateCart(body);
            } else {
                CommonService.isDupicateVariants(variants);
                body.product_id = UUID.v1();
                body.product_status = 0;
                body.shipping = ['Ground Shipping'];
                delete (body.removed_images);
                var params = {
                    TableName: process.env.PRODUCTS_TABLE,
                    Item: body
                };
                docClient.put(params).promise();
                this.createVariants(variants, body);
            }
            return callback(null, Utils.successResponse({ 'product_id': body.product_id }, 'Success!!'));
        } catch (error) {
            Logger.error('createProducts:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async deleteProductVariants (body) {
        try {
            for (const key in body.remove_variants) {
                if (Object.hasOwnProperty.call(body.remove_variants, key)) {
                    const ele = body.remove_variants[key];
                    var params = {
                        TableName: 'Size_variants',
                        Key: {
                            'product_id': body.product_id,
                            'variant_id': ele.variant_id
                        }
                    };
                    await docClient.delete(params).promise();
                    const size = `${ele.variant_size} ${ele.variant_type}`;
                    this.removeFulfillmentCenterInventory(body.brand_id, body.product_id, size, Constants.FC_ID);
                }
            }
        } catch (error) {
            Logger.error('deleteProductVariants:catch', error);
        }
    }

    /**
     * @desc This function is being used to validate create product request
     * @param {Object} req Request
     * @param {Object} req.body Body
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.product_name Product name
     * @param {Object} req.body.product_images Product Images
     * @param {String} req.body.product_alcohol_type Product Alcohol Type
     * @param {String} req.body.product_description Product Description
     * @param {String} req.body.product_size_variants Product Size Variants
     */
    validateRequest (body) {
        if (!body.brand_id) {
            throw Message.PRODUCT.BRAND_ID_REQUIRED;
        } else if (!body.product_name) {
            throw Message.PRODUCT.PRODUCT_NAME_REQUIRED;
        } else if (!body.product_images) {
            throw Message.PRODUCT.PRODUCT_IMAGES_REQUIRED;
        } else if (!body.alcohol_type) {
            throw Message.PRODUCT.PRODUCT_AL_TYPE_REQUIRED;
        } else if (!body.ABV) {
            throw Message.PRODUCT.PRODUCT_ABV_REQUIRED;
        } else if (!body.product_size_variants && !body.product_id) {
            throw Message.PRODUCT.PRODUCT_VARIANTS_REQUIRED;
        } else {
            return;
        }
    }

    /**
     * Function to start process adding variants
     * @param {*} productVariants
     * @param {*} body
     */
    async createVariants (productVariants, body) {
        const projection = 'brand_name, fulfillment_options, product_fulfillment_center';
        const brandDetail = await CommonService.getBrandDetail(body.brand_id, projection);
        if ((brandDetail.fulfillment_options === Constants.FULFILLMENT_OPTION.PRODUCT &&
            brandDetail.product_fulfillment_center.indexOf(body.alcohol_type) != -1) ||
            brandDetail.fulfillment_options === Constants.FULFILLMENT_OPTION.MARKET) {
            await this.addVariants(productVariants, body, brandDetail, true);
            CommonService.updateProductInventory({ brand_id: body.brand_id });
        } else {
            await this.addVariants(productVariants, body, brandDetail, false);
        }
    }

    /**
     * Function to add variants based on brands fulfillment preference
     * @param {*} productVariants
     * @param {*} body
     * @param {*} brandDetail
     * @param {*} createFCInventory
     */
    async addVariants (productVariants, body, brandDetail, createFCInventory) {
        productVariants.forEach((value) => {
            if (!value.variant_id) {
                value.variant_id = UUID.v4();
                value.product_id = body.product_id;
                value.createdAt = new Date().getTime();
                value.updatedAt = new Date().getTime();
                value.brand_id = body.brand_id;
                value.product_name = body.product_name;
                value.alcohol_type = body.alcohol_type;
                var params = {
                    TableName: process.env.SIZE_VARIANTS_TABLE,
                    Item: value
                };
                docClient.put(params).promise();
                if (createFCInventory) {
                    CommonService.createFulfillmentCenterInventory(body, brandDetail, value);
                }
            }
        });
    }

    /**
    * @desc This function is being used to delete file from s3 bucket
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    deleteS3File (body) {
        if (body.removed_images && body.removed_images.length) {
            body.removed_images.forEach(file => {
                if (file) {
                    const params = {
                        Bucket: process.env.BucketName,
                        Key: file
                    };
                    s3.deleteObject(params, (err) => {
                        if (err) {
                            Logger.error('deleteS3File:', err);
                        } else {
                            Logger.info('deleteS3File:', file);
                        }
                    });
                }
            });
        }
        delete (body.removed_images);
    }

    /**
    * @desc This function is being used to update product details
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateProduct (body) {
        const data = {};
        data.tableName = process.env.PRODUCTS_TABLE;
        data.key = { brand_id: body.brand_id, product_id: body.product_id };
        data.field = {
            'product_name': body.product_name,
            'search_product_name': body.search_product_name,
            'description': body.description,
            'alcohol_type': body.alcohol_type,
            'ABV': body.ABV,
            'product_images': body.product_images,
            'variants_count': body.variants_count,
            'availability_count': body.availability_count
        };
        this.updateTableItems(data);
    }

    /**
    * @desc This function is being used to update saved product details
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateSavedProduct (body) {
        var params = {
            TableName: process.env.SAVED_PRODUCTS_TABLE,
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':product_id': body.product_id
            },
            ProjectionExpression: 'product_id, createdAt'
        };
        const productData = await docClient.query(params).promise();
        if (productData.Count > 0) {
            const data = {};
            data.tableName = process.env.SAVED_PRODUCTS_TABLE;
            data.key = { brand_id: body.brand_id, createdAt: productData.Items[0].createdAt };
            data.field = {
                'product_name': body.product_name,
                'search_product_name': body.search_product_name,
                'description': body.description,
                'alcohol_type': body.alcohol_type,
                'ABV': body.ABV,
                'product_images': body.product_images
            };
            this.updateTableItems(data);
        }
    }

    /**
    * @desc This function is being used to update product details in products addresses
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateProductAddresses (body) {
        var params = {
            TableName: process.env.PRODUCTS_ADDRESSES_TABLE,
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':product_id': body.product_id
            },
            ProjectionExpression: 'product_id, createdAt'
        };
        const addressData = await docClient.query(params).promise();
        if (addressData.Count > 0) {
            addressData.Items.forEach(async (value) => {
                const data = {};
                data.tableName = process.env.PRODUCTS_ADDRESSES_TABLE;
                data.key = { brand_id: body.brand_id, createdAt: value.createdAt };
                data.field = {
                    'product_name': body.product_name,
                    'description': body.description
                };
                this.updateTableItems(data);
            });
        }
    }

    /**
    * @desc This function is being used to update product details in size variants
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateSizeVariants (body) {
        var params = {
            TableName: process.env.SIZE_VARIANTS_TABLE,
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': body.product_id
            },
            ProjectionExpression: 'product_id, variant_id'
        };
        const variantData = await docClient.query(params).promise();
        if (variantData.Count > 0) {
            variantData.Items.forEach(async (value) => {
                const data = {};
                data.tableName = process.env.SIZE_VARIANTS_TABLE;
                data.key = { product_id: body.product_id, variant_id: value.variant_id };
                data.field = {
                    'product_name': body.product_name,
                    'alcohol_type': body.alcohol_type
                };
                this.updateTableItems(data);
            });
        }
    }

    /**
    * @desc This function is being used to update product details in inventory
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateInventory (body, tableName) {
        var params = {
            TableName: tableName,
            FilterExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': body.product_id
            }
        };
        const inventoryData = await docClient.scan(params).promise();
        if (inventoryData.Count > 0) {
            inventoryData.Items.forEach(async (value) => {
                const data = {};
                data.tableName = tableName;
                if (value.retailer_id) {
                    data.key = { retailer_id: value.retailer_id, createdAt: value.createdAt };
                } else {
                    data.key = { fulfillment_center_id: value.fulfillment_center_id, createdAt: value.createdAt };
                }
                data.field = {
                    'product_name': body.product_name,
                    'search_product_name': (body.product_name).toLowerCase(),
                    'alcohol_type': body.alcohol_type,
                    'search_alcohol_type': (body.alcohol_type).toLowerCase(),
                    'description': body.description
                };
                this.updateTableItems(data);
            });
        }
    }

    /**
    * @desc This function is being used to update product details in cart
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    async updateCart (body) {
        var params = {
            TableName: process.env.CART_TABLE,
            FilterExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': body.product_id
            },
            ProjectionExpression: 'user_id, cart_id'
        };
        const cartData = await docClient.scan(params).promise();
        if (cartData.Count > 0) {
            cartData.Items.forEach(async (value) => {
                const data = {};
                data.tableName = process.env.CART_TABLE;
                data.key = { user_id: value.user_id, cart_id: value.cart_id };
                data.field = {
                    'product_name': body.product_name,
                    'product_img': body.product_images.img_1
                };
                this.updateTableItems(data);
            });
        }
    }

    /**
    * @desc This function is being used to update table items
    * @param {Object} data Data
    */
    async updateTableItems (data) {
        var params = {
            TableName: data.tableName,
            Key: data.key,
            ExpressionAttributeValues: {},
            UpdateExpression: ''
        };
        let prefix = 'SET ';
        for (const [key, value] of Object.entries(data.field)) {
            params.UpdateExpression += `${prefix} ${key} = :${key}`;
            params.ExpressionAttributeValues[`:${key}`] = value;
            prefix = ', ';
        }
        await docClient.update(params).promise();
    }

    /**
     * Function to remove fulfillment inventor
     * @param {*} brandId
     * @param {*} productId
     * @param {*} size
     * @param {*} fcId
     */
    async removeFulfillmentCenterInventory (brandId, productId, size, fcId) {
        const params = {
            TableName: 'Fulfillment_inventory',
            IndexName: 'brand_id-index',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':fulfillment_center_id': fcId,
                ':brand_id': brandId,
                ':product_id': productId,
                ':size': size
            },
            FilterExpression: 'fulfillment_center_id = :fulfillment_center_id AND product_id = :product_id AND size = :size',
            ProjectionExpression: 'createdAt'
        };
        const result = await docClient.query(params).promise();
        if (result.Items.length) {
            const deleteParams = {
                TableName: 'Fulfillment_inventory',
                Key: {
                    'fulfillment_center_id': fcId,
                    'createdAt': result.Items[0].createdAt
                }
            };
            await docClient.delete(deleteParams).promise();
        }
    }


}
module.exports.CreateBrandProductsHandler = async (event, context, callback) =>
    new CreateBrandProducts().createProducts(event, context, callback);
