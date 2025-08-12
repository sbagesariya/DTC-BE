const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
class GetFulfillmentSettings {

    /**
     * @desc This function is being used to get fulfillment settings
     * @createdDate 05-10-2021
     * @param {Object} req Request
     * @param {String} req.pathParameters Brand Id
     */
    async getFulfillmentSettings (req) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async () => {
            try {
                const params = {
                    TableName: 'Fulfillment_centers',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    }
                };
                const result = await docClient.query(params).promise();
                if (result.Items.length) {
                    result.Items[0].markets = await this.getFulfillmentPreference(body.brand_id);
                }
                Logger.info('getFulfillmentSettings:sucess');
                return Utils.successResponse(result.Items[0]);
            } catch (error) {
                Logger.error('getFulfillmentSettings:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getFulfillmentSettings:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate get fulfillment settings
     * @createdDate 05-10-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
     * This function is being used to get selected fulfillment preference
     *
     * @param {String} brandId
     */
    async getFulfillmentPreference (brandId) {
        let markets = {};
        const params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            ProjectionExpression: 'fulfillment_options, market_fulfillment_center, markets'
        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        if (items.length) {
            if (items[0].fulfillment_options === Constant.MARKET) {
                markets = items[0].market_fulfillment_center;
            } else {
                markets = items[0].markets;
            }
        }
        return markets;
    }
}
module.exports.GetFulfillmentSettingsHandler = async (event, context, callback) =>
    new GetFulfillmentSettings().getFulfillmentSettings(event, context, callback);
