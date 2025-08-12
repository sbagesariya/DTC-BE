// Create clients and set shared const values outside of the handler.
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

const Utils = require('../../utils/lambda-response');
const Message = require('./../../utils/message');
const Logger = require('./../../utils/logger');
const Constants = require('../../utils/constants');

class RemoveProducts {
    /**
     * @desc This function is being used to remove brand products
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {Array} req.body.product_ids Product ids
     */
    removeProducts (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                this.getProducts(body);
                this.getSavedProducts(body);
                this.getProductsFromProductAddress(body);
                this.getProductsFromSizeVariants(body);
                this.getProductsFromInventory(body);
                this.getProductsFromCart(body);
                return callback(null, Utils.successResponse([], 'Products delete successful'));
            } catch (error) {
                Logger.error('removeProducts:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('removeProducts:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate remove products request
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {Array} req.body.product_ids Product ids
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.PRODUCT.BRAND_ID_REQUIRED);
            } else if (!body.product_ids) {
                reject(Message.PRODUCT.PRODUCT_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to prepare Request
    * @param {Object} body body
    * @param {String} tableName Table Name
    */
    async prepareReq (body, tableName) {
        var titleObject = {};
        var index = 0;
        var titleKey = '';
        body.product_ids.forEach((value) => {
            index++;
            titleKey = `${titleKey}product_id = :product_id${index} or `;
            titleObject[':product_id' + index] = value;
        });
        titleKey = titleKey.substring(0, titleKey.length - 4);
        var params = {
            TableName: tableName,
            FilterExpression: titleKey,
            ExpressionAttributeValues: titleObject
        };
        const items = await docClient.scan(params).promise();
        return items.Items;
    }

    /**
    * @desc This function is being used to remove products
    * @param {Object} body body
    */
    async getProducts (body) {
        var itemsArray = [];
        for (const key in body.product_ids) {
            if (Object.hasOwnProperty.call(body.product_ids, key)) {
                const productId = body.product_ids[key];
                const checkProduct = await this.checkProductExist(body.brand_id, productId);
                if (checkProduct > 0) {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'brand_id': body.brand_id,
                                'product_id': productId
                            }
                        }
                    };
                    itemsArray.push(item);
                }
            }
        }
        this.removeTableItems(itemsArray, process.env.PRODUCTS_TABLE);
    }

    /**
    * @desc This function is being used to fetch & remove products form saved products table
    * @param {Object} body body
    */
    async getSavedProducts (body) {
        try {
            const res = await this.prepareReq(body, process.env.SAVED_PRODUCTS_TABLE);
            var itemsArray = [];
            if (res.length) {
                res.forEach((val) => {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'brand_id': val.brand_id,
                                'createdAt': val.createdAt
                            }
                        }
                    };
                    itemsArray.push(item);
                });
            }
            this.removeTableItems(itemsArray, process.env.SAVED_PRODUCTS_TABLE);
        } catch (err) {
            Logger.error('getSavedProducts:error', err);
        }
    }

    /**
    * @desc This function is being used to fetch & remove products addresses
    * @param {Object} body body
    */
    async getProductsFromProductAddress (body) {
        try {
            const result = await this.prepareReq(body, process.env.PRODUCTS_ADDRESSES_TABLE);
            var itemsArray = [];
            if (result.length) {
                result.forEach((value) => {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'brand_id': value.brand_id,
                                'createdAt': value.createdAt
                            }
                        }
                    };
                    itemsArray.push(item);
                });
            }
            this.removeTableItems(itemsArray, process.env.PRODUCTS_ADDRESSES_TABLE);
        } catch (err) {
            Logger.error('getProductsFromProductAddress:error', err);
        }
    }

    /**
    * @desc This function is being used to fetch & remove size variants records
    * @param {Object} body body
    */
    async getProductsFromSizeVariants (body) {
        try {
            const result = await this.prepareReq(body, process.env.SIZE_VARIANTS_TABLE);
            var itemsArray = [];
            if (result.length) {
                result.forEach((value) => {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'product_id': value.product_id,
                                'variant_id': value.variant_id
                            }
                        }
                    };
                    itemsArray.push(item);
                });
            }
            this.removeTableItems(itemsArray, process.env.SIZE_VARIANTS_TABLE);
        } catch (err) {
            Logger.error('getProductsFromSizeVariants:error', err);
        }
    }

    /**
    * @desc This function is being used to fetch & remove inventory products
    * @param {Object} body body
    */
    async getProductsFromInventory (body) {
        try {
            const result = await this.prepareReq(body, process.env.INVENTORY_TABLE);
            var itemsArray = [];
            if (result.length) {
                result.forEach((value) => {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'retailer_id': value.retailer_id,
                                'createdAt': value.createdAt
                            }
                        }
                    };
                    itemsArray.push(item);
                });
            }
            this.removeTableItems(itemsArray, process.env.INVENTORY_TABLE);
        } catch (err) {
            Logger.error('getProductsFromInventory:error', err);
        }
    }

    /**
    * @desc This function is being used to fetch & remove cart products
    * @param {Object} body body
    */
    async getProductsFromCart (body) {
        try {
            const result = await this.prepareReq(body, process.env.CART_TABLE);
            var itemsArray = [];
            if (result.length) {
                result.forEach((value) => {
                    const item = {
                        DeleteRequest: {
                            Key: {
                                'user_id': value.user_id,
                                'cart_id': value.cart_id
                            }
                        }
                    };
                    itemsArray.push(item);
                });
            }
            this.removeTableItems(itemsArray, process.env.CART_TABLE);
        } catch (err) {
            Logger.error('getProductsFromCart:error', err);
        }
    }

    /**
    * @desc This function is being used to remove table items
    * @param {Object} itemsArray Items Array
    * @param {String} tableName Table Name
    */
    async removeTableItems (itemsArray, tableName) {
        if (itemsArray.length) {
            const deleteItems = await this.chunkArray(itemsArray, Constants.PRODUCT_CHUNK_SIZE);
            try {
                deleteItems.forEach((items) => {
                    var params = {
                        RequestItems: {
                            [tableName]: items
                        }
                    };
                    docClient.batchWrite(params).promise();
                });
            } catch (error) {
                Logger.error('removetableitems:catch', error);
            }
        }
    }

    /**
    * @desc This function is being used to splice array data
    */
    async chunkArray (itemsArray, size) {
        var results = [];
        if (itemsArray.length > Constants.PRODUCT_CHUNK_SIZE) {
            while (itemsArray.length) {
                results.push(itemsArray.splice(0, size));
            }
        } else {
            results.push(itemsArray);
        }
        return results;
    }

    /**
    * @desc This function is being used to check product is exist or not
    * @param {String} brandId brandId
    * @param {String} productId ProductId
    */
    async checkProductExist (brandId, productId) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':product_id': productId
            },
            Select: 'COUNT'
        };
        const data = await docClient.query(params).promise();
        return data.Count;
    }
}

module.exports.RemoveBrandProductsHandler = async (event, context, callback) =>
    new RemoveProducts().removeProducts(event, context, callback);
