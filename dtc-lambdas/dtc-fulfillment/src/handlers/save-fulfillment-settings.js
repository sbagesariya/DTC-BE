const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const UUID = require('uuid');
const Constant = require('../../utils/constants');
class SaveFulfillmentSettings {

    /**
     * @desc This function is being used to save fulfillment settings
     * @createdDate 05-10-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.primary_email_address Primary Email Address
     * @param {Array} req.body.fulfillment_center_name Fulfillment Center Name
     * @param {Array} req.body.primary_contact_number Primary Contact Number
     * @param {Array} req.body.is_fulfillment_center Is Fulfillment Center
     * @param {Array} req.body.primary_address Primary Address
     * @param {Array} req.body.shipping_zones_rates Shipping Zones Rates
     */
    async saveFulfillmentSettings (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (data) => {
            try {
                let itemData = data;
                if (body.is_fulfillment_center) {
                    itemData = { ...data, ...Constant.PARKSTREET_FULFILLMENT_CENTER };
                }
                var params = {
                    TableName: 'Fulfillment_centers',
                    Item: itemData
                };
                const result = await docClient.put(params).promise();
                Logger.info('saveFulfillmentSettings:sucess');
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('saveFulfillmentSettings:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('saveFulfillmentSettings:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate save fulfillment settings
     * @createdDate 05-10-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {Array} req.body.primary_address Primary Address
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.is_fulfillment_center && (!body.primary_address || Object.keys(body.primary_address).length === 0 )) {
                reject(Message.INVALID_REQUEST);
            } else if (body.fulfillment_center_id) {
                const params = {
                    TableName: 'Fulfillment_centers',
                    KeyConditionExpression: 'brand_id = :brand_id AND fulfillment_center_id = :fulfillment_center_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id,
                        ':fulfillment_center_id': body.fulfillment_center_id
                    }
                };
                const fulfillmentCenterData = await docClient.query(params).promise();
                if (fulfillmentCenterData.Count === 0) {
                    reject(Message.INVALID_FULFILLMENT_CENTER);
                } else {
                    resolve(body);
                }
            } else {
                body.fulfillment_center_id = UUID.v1();
                resolve(body);
            }
        });
    }

}
module.exports.SaveFulfillmentSettingsHandler = async (event, context, callback) =>
    new SaveFulfillmentSettings().saveFulfillmentSettings(event, context, callback);
