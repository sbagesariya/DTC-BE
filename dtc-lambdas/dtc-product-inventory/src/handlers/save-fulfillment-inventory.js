const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');

class SaveFulfillmentInventory {

    /**
     * @desc This function is being used to save fulfillment product inventory
     * @createdDate 20-10-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.fulfillment_center_id Fulfillment Center Id
     * @param {String} req.body.createdAt createdAt
     * @param {String} req.body.alcohol_type Alcohol Type
     * @param {String} req.body.size Size
     * @param {Integer} req.body.stock Stock
     * @param {String} req.body.product_name Product Name
     * @param {Integer} req.body.sku_code SKU Code
     * @param {Array} req.body.unit_price_per_market Unit Price Per Market
     */
    async saveFulfillmentInventory (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (data) => {
            try {
                var params = {
                    TableName: 'Fulfillment_inventory',
                    Item: data
                };
                const result = await docClient.put(params).promise();
                Logger.info('saveFulfillmentInventory:sucess');
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('saveFulfillmentInventory:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('saveFulfillmentInventory:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate request
     * @createdDate 05-10-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.createdAt Created At date
     * @param {String} req.body.fulfillment_center_id Fulfillment Center Id
     * @param {Array} req.body.unit_price_per_market Unit Price Per Market
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.createdAt) {
                reject(Message.CREATED_AT);
            } else if (!body.fulfillment_center_id) {
                reject(Message.FULFILLMENT_CENTER_ID_REQUIRE);
            } else if (!body.unit_price_per_market || Object.keys(body.unit_price_per_market).length === 0 ) {
                reject(Message.INVALID_REQUEST);
            } else {
                const params = {
                    TableName: 'Fulfillment_inventory',
                    KeyConditionExpression: 'fulfillment_center_id = :fulfillment_center_id AND createdAt = :createdAt',
                    ExpressionAttributeValues: {
                        ':fulfillment_center_id': body.fulfillment_center_id,
                        ':createdAt': body.createdAt
                    }
                };
                const fulfillmentInventoryData = await docClient.query(params).promise();
                if (fulfillmentInventoryData.Count === 0) {
                    reject(Message.NO_RECORD_FOUND);
                } else {
                    body.search_product_name = (body.product_name).toLowerCase();
                    body.search_alcohol_type = (body.alcohol_type).toLowerCase();
                    body.search_size = (body.size).toLowerCase();
                    body.search_stock = (body.stock).toString();
                    body.search_sku_code = (body.sku_code || '').toString();
                    const itemData = { ...fulfillmentInventoryData.Items[0], ...body };
                    resolve(itemData);
                }
            }
        });
    }

}
module.exports.saveFulfillmentInventoryHandler = async (event, context, callback) =>
    new SaveFulfillmentInventory().saveFulfillmentInventory(event, context, callback);
