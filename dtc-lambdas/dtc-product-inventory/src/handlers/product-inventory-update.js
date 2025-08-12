const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Constant = require('./../../utils/constants');

class ProductInventoryUpdate {
    /**
    * @desc This function is being used to update product inventory detail of stock, unit_price and retailer product ID
    * @since 28/04/2021
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.retailer_id Retailer Id
    * @param {String} req.body.created_at Created At
    * @param {number} req.body.stock Stock
    * @param {number} req.body.unit_price Unit price
    * @param {String} req.body.retailer_product_id Retailer product Id
    */
    async productInventoryUpdate (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            const params = {
                TableName: 'Inventory',
                Key: { retailer_id: body.retailer_id, createdAt: body.created_at },
                UpdateExpression: '',
                ExpressionAttributeValues: {}
            };
            if (body.stock !== undefined) {
                params.UpdateExpression = 'SET stock = :stock';
                params.ExpressionAttributeValues[':stock'] = body.stock;
            }
            if (body.unit_price !== undefined) {
                params.UpdateExpression = 'SET unit_price = :unit_price';
                params.ExpressionAttributeValues[':unit_price'] = body.unit_price;
            }
            if (body.retailer_product_id !== undefined) {
                params.UpdateExpression = 'SET retailer_product_id = :retailer_product_id';
                params.ExpressionAttributeValues[':retailer_product_id'] = body.retailer_product_id || Constant.DEFAULT_RETAILER_ID;
            }
            const result = await docClient.update(params).promise();
            return Utils.successResponse(result);
        }).catch((err) => {
            Logger.error('productInventoryUpdate:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate product inventory detail update request
     * @since 28/04/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.retailer_id) {
                reject(Message.RETAILER_REQUIRED);
            } else if (!body.created_at) {
                reject(Message.CREATED_AT);
            } else if (!body.stock && !body.unit_price && !body.retailer_product_id) {
                reject(Message.INVALID_REQUEST);
            } else {
                resolve();
            }
        });
    }
}
module.exports.ProductInventoryUpdateHandler = async (event, context, callback) =>
    new ProductInventoryUpdate().productInventoryUpdate(event, context, callback);
