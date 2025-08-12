const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const Constant = require('./../../utils/constants');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
class AddProductInventory {
    /**
    * @desc This function is being used to save product inventory
    * @param {Object} req Request
    * @param {array} req.body RequestBody
    * @param {String} req.body.retailer_id Retailer Id
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.product_id Product Id
    * @param {String} req.body.brand_name Brand name
    * @param {String} req.body.product_name Product name
    * @param {String} req.body.variant_size Variant size
    * @param {number} req.body.upc_code UPC Code
    * @param {number} req.body.stock Available Stock
    * @param {String} req.body.alcohol_type Alcohole type
    * @param {number} req.body.unit_price Unit Price
    */
    async addProductInventory (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (itemsArray) => {
            const batchUpdateQuery = {
                RequestItems: {
                    'Inventory': itemsArray
                }
            };
            try {
                const result = await docClient.batchWrite(batchUpdateQuery).promise();
                this.updateProductStatus(body);
                return callback(null, Utils.successResponse(result, Message.INSERTED_SUCCESSFULLY));
            } catch (error) {
                return Utils.errorResponse(Message.SOMETHING_WENT_WRONG, error);
            }
        }).catch((err) => {
            Logger.error('addProductInventory:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate product inventory request
     * @since 26/04/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            let isValid = false;
            const itemsArray = [];
            if (!Array.isArray(body)) {
                reject(Message.INVALID_REQUEST);
            }
            for (const index in body) {
                if (Object.hasOwnProperty.call(body, index)) {
                    isValid = true;
                    const ele = body[index];
                    const conditionsToCheck = [
                        ele.retailer_id, ele.brand_id, ele.product_id, ele.brand_name, ele.product_name,
                        ele.variant_size, ele.alcohol_type, ele.upc_code, ele.stock, ele.unit_price
                    ];
                    if (conditionsToCheck.every(condition => condition)) {
                        const detail = await this.getProductDetail(ele);
                        ele.shipping = detail.shipping || [];
                        ele.product_images = detail.product_images;
                        ele.retailer_product_id = Constant.DEFAULT_RETAILER_ID;
                        ele.search_retailer_product_id = Constant.DEFAULT_RETAILER_ID;
                        ele.size = ele.variant_size;
                        ele.search_product_name = ele.product_name.toLowerCase();
                        ele.search_brand_name = ele.brand_name.toLowerCase();
                        ele.sort_brand_name = ele.brand_name.toLowerCase();
                        ele.search_alcohol_type = ele.alcohol_type.toLowerCase();
                        ele.search_size = ele.variant_size.toLowerCase();
                        ele.createdAt = ((new Date()).getTime()) + parseInt(index);
                        ele.updatedAt = ((new Date()).getTime()) + parseInt(index);
                        delete ele.variant_size;
                        itemsArray.push({
                            PutRequest: {
                                Item: ele
                            }
                        });
                    } else {
                        isValid = false;
                    }
                }
            }
            if (isValid) {
                resolve(itemsArray);
            } else {
                reject(Message.INVALID_REQUEST);
            }
        });
    }

    /**
    * @desc This function is being used to get product details
    * @param {Array} ele
    * @param {String} ele.product_id Product Id
    * @param {String} ele.brand_id Brand Id
    */
    async getProductDetail (ele) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': ele.brand_id,
                ':product_id': ele.product_id
            },
            ProjectionExpression: 'product_images, shipping'
        };
        const result = await docClient.query(params).promise();
        return result.Count ? result.Items[0] : null;
    }

    /**
    * @desc This function is being used to update product status
    * @param {Array} body
    * @param {String} body.product_id Product Id
    * @param {String} body.brand_id Brand Id
    */
    async updateProductStatus (body) {
        body.forEach((ele) => {
            var params = {
                TableName: 'Products',
                Key: {
                    brand_id: ele.brand_id,
                    product_id: ele.product_id
                },
                UpdateExpression: 'SET #product_status = :product_status',
                ExpressionAttributeNames: {
                    '#product_status': 'product_status'
                },
                ExpressionAttributeValues: {
                    ':product_status': 1
                }
            };
            docClient.update(params).promise();
        });
    }
}
module.exports.AddProductInventoryHandler = async (event, context, callback) =>
    new AddProductInventory().addProductInventory(event, context, callback);
