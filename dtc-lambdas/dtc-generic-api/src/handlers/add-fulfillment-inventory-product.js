const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Constant = require('../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Message = require('../../utils/message');
const NavigatorService = require('./../services/navigator.service');
class AddFulfillmentInventoryProduct {

    /**
    * @desc This function is being used to add/update fulfillment inventory product
    */
    async addFulfillmentInventoryProduct (req, context, callback) {
        try {
            const body = JSON.parse(req.body);
            const brands = await this.getBrands(body);
            for (const key in brands) {
                if (Object.hasOwnProperty.call(brands, key)) {
                    const brandDetail = brands[key];
                    const product = await this.getProducts(brandDetail);
                    if (product.Items.length) {
                        await this.getProductInventory(product.Items, brandDetail);
                        await this.getBrandProducts(brandDetail, product.Items);
                        NavigatorService.updateProductInventory({ brand_id: brandDetail.brand_id });
                    }
                }
            }
            return callback(null, Utils.successResponse({}, Constant.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('addFulfillmentInventoryProduct:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to get brands products and update product status
    * @param {Object} brandDetail Brand details
    * @param {Array} products Products array
    */
    async getBrandProducts (brandDetail, products) {
        if (brandDetail.fulfillment_options === Constant.FULFILLMENT_OPTION && brandDetail.product_fulfillment_center.length) {
            const productIds = products.map(item => item.product_id);
            const allProduct = await this.getProducts({ brand_id: brandDetail.brand_id });
            if (allProduct.Items.length) {
                allProduct.Items.forEach(item => {
                    if (productIds.indexOf(item.product_id) === -1) {
                        this.updateInventoryProductStatus(item);
                    }
                });
            }
        }
    }

    /**
    * @desc This function is being used to update product status
    * @param {Array} products Products array
    */
    updateInventoryProductStatus (product) {
        var params = {
            TableName: 'Inventory',
            IndexName: 'product_id-index',
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': product.product_id
            },
            ProjectionExpression: 'retailer_id, createdAt'
        };
        docClient.query(params, (err, result) => {
            if (err) {
                Logger.error('updateInventoryProductStatus:err', err);
            } else if (!result.Items.length) {
                this.updateProductStatus(product, 0);
            }
        });
    }


    async getProductInventory (products, brandDetail) {
        var params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {}
        };
        for (const key in products) {
            if (Object.hasOwnProperty.call(products, key)) {
                const productDetail = products[key];
                params.ExpressionAttributeValues[':product_id'] = productDetail.product_id;
                const productVariants = await docClient.query(params).promise();
                if (productVariants.Items.length) {
                    await this.getInventoryFromProduct(productDetail, brandDetail, productVariants.Items);
                    this.updateProductStatus(productDetail);
                }

            }
        }
    }

    /**
    * @desc This function is being used to add/update fulfillment inventory product
    */
    async updateProductStatus (data, status = 1) {
        var params = {
            TableName: 'Products',
            Key: { brand_id: data.brand_id, product_id: data.product_id },
            UpdateExpression: 'SET product_status = :product_status',
            ExpressionAttributeValues: {
                ':product_status': status
            }
        };
        docClient.update(params, (err) => {
            if (err) {
                Logger.error('updateProductStatus:err', err);
            }
        });
    }

    /**
    * @desc This function is being used to add/update fulfillment inventory product
    */
    async getInventoryFromProduct (productDetail, brandDetail, productVariants) {
        for (const key in productVariants) {
            if (Object.hasOwnProperty.call(productVariants, key)) {
                const variant = productVariants[key];
                const fulfillmentInventory = this.prepareFulfillmentInventory(productDetail, brandDetail, variant);
                await this.updateFillfillmentInventory(fulfillmentInventory);
            }
        }

    }

    /**
    * @desc This function is being used to add/update fulfillment inventory product
    */
    async updateFillfillmentInventory (fulfillmentInventory) {
        try {
            var params = {
                TableName: process.env.FULFILLMENT_INVENTORY_TABLE,
                Item: fulfillmentInventory
            };
            await docClient.put(params).promise();
        } catch (error) {
            Logger.error('updateFillfillmentInventory:catch', error);
        }
    }

    /**
    * @desc This function is being used to get products by brand id
    */
    async getProducts (body) {
        var params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            }
        };
        if (body.fulfillment_options === Constant.FULFILLMENT_OPTION && body.product_fulfillment_center.length) {
            let filterExpression = '';
            body.product_fulfillment_center.forEach((item, i) => {
                filterExpression = `${filterExpression}:alcohol_type${i}${body.product_fulfillment_center.length - 1 === i ? ')' : ','}`,
                params.ExpressionAttributeValues[`:alcohol_type${i}`] = item;
            });
            params.FilterExpression = `alcohol_type IN(${filterExpression}`;
        }
        return await docClient.query(params).promise();
    }

    /**
    * @desc This function is being used to get brands
    */
    async getBrands (body) {
        var params = {
            TableName: 'Brands'
        };
        if (Array.isArray(body.brands) && body.brands.length) {
            params.ExpressionAttributeValues = {};
            body.brands.forEach((item, index) => {
                params.FilterExpression = `brand_id = :brand_id${index}`;
                params.ExpressionAttributeValues[`:brand_id${index}`] = item.id;
            });
            await this.deleteFulfillmentInventoryOfBrand(body.brands);
        }
        const brands = await docClient.scan(params).promise();
        if (brands.Items.length) {
            return brands.Items;
        }
        throw Message.BRAND_NOT_FOUND;
    }

    /**
    * @desc This function is being used to prepare add product fulfillment inventory object
    */
    prepareFulfillmentInventory (product, brandDetail, variant) {
        return {
            fulfillment_center_id: Constant.FULFILLMENT_CENTER_ID,
            product_id: product.product_id,
            fulfillment_product_id: '',
            brand_id: product.brand_id,
            product_name: product.product_name,
            brand_name: brandDetail.brand_name,
            alcohol_type: product.alcohol_type,
            size: `${variant.variant_size} ${variant.variant_type}`,
            upc_code: variant.upc_code,
            unit_price: 0,
            stock: 0,
            search_stock: '0',
            search_product_name: (product.product_name).toLowerCase(),
            search_brand_name: (brandDetail.brand_name).toLowerCase(),
            sort_brand_name: brandDetail.brand_name,
            search_fulfillment_product_id: '',
            search_alcohol_type: (product.alcohol_type).toLowerCase(),
            search_size: (`${variant.variant_size} ${variant.variant_type}`).toLowerCase(),
            product_images: product.product_images,
            unit_price_per_market: [], // Fulfillment
            shipping: product.shipping,
            sku_code: variant.sku_code,
            search_sku_code: (variant.sku_code || '').toLowerCase(),
            warehouse: '', // Fulfillment
            location_group: '', // Fulfillment
            location: '', // Fulfillment
            createdAt: (new Date()).getTime(),
            updatedAt: (new Date()).getTime()
        };

    }

    /**
    * @desc This function is being used to delete all the fullfillment inventory of a brand
    */
    async deleteFulfillmentInventoryOfBrand (brands) {
        brands.forEach(async (brand) => {
            var params = {
                TableName: process.env.FULFILLMENT_INVENTORY_TABLE,
                KeyConditionExpression: 'brand_id = :brand_id',
                IndexName: 'brand_id-index',
                ExpressionAttributeValues: {
                    ':brand_id': brand.id
                },
                ProjectionExpression: 'fulfillment_center_id, createdAt'
            };
            const result = await docClient.query(params).promise();
            if (result.Items.length) {
                result.Items.forEach(async (data) => {
                    const deleteParams = {
                        TableName: process.env.FULFILLMENT_INVENTORY_TABLE,
                        Key: data
                    };
                    docClient.delete(deleteParams, (err)=> {
                        if (err) {
                            Logger.error('deleteFulfillmentInventoryOfBrand:catch', err);
                        }
                    });
                });
            }
        });
    }
}

module.exports.AddFulfillmentInventoryProductHandler = async (event, context, callback) =>
    new AddFulfillmentInventoryProduct().addFulfillmentInventoryProduct(event, context, callback);
