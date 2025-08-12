const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');

class Fulfillment {

    /**
     * @desc This function is being used to get fulfillment data
     * @since 10/09/2021
     * @param {Object} req Request
     * @param {String} req.pathParameters.brand_id Brand Id
     */
    async getFulfillment (req) {
        const body = req.pathParameters;
        var prefrenceCount = {
            'product_limit': 0,
            'products_added': 0,
            'market_limit': 0,
            'markets_added': 0
        };
        return this.validateRequest(body).then(async () => {
            try {
                const limits = await this.getLimits(body);
                const fulfillmentPreference = await this.getFulfillmentPreference(body);
                prefrenceCount.products_added = await this.getProductsAdded(body);
                prefrenceCount.markets_added = (fulfillmentPreference.markets) ? fulfillmentPreference.markets.length : 0;
                prefrenceCount.product_limit = (limits) ? limits.max_product_count : 0;
                prefrenceCount.market_limit = (limits) ? limits.max_market_count : 0;
                return Utils.successResponse({
                    'preference_count': prefrenceCount,
                    'fulfillment_preference': fulfillmentPreference
                });
            } catch (error) {
                Logger.error('getFulfillment:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getFulfillment:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} body RequestBody
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
     * @desc This function is being used to get limit
     * @since 10/09/2021
     * @param {Object} body Body
     */
    async getLimits (body) {
        var params = {
            TableName: 'Portal_users',
            IndexName: 'user_id-index',
            KeyConditionExpression: '#brand = :brand_id',
            ExpressionAttributeNames: {
                '#brand': 'user_id'
            },
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            },
            ProjectionExpression: 'max_product_count, max_market_count'

        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        return items[0];
    }

    /**
     * @desc This function is being used to get added product count
     * @since 10/09/2021
     * @param {Object} body Body
     */
    async getProductsAdded (body) {
        var params = {
            TableName: 'Products',
            KeyConditionExpression: '#brand = :brand_id',
            ExpressionAttributeNames: {
                '#brand': 'brand_id'
            },
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            },
            Select: 'COUNT'

        };
        const data = await docClient.query(params).promise();
        return data.Count;
    }

    /**
     * @desc This function is being used to get selected fulfillment preference
     * @since 15/09/2021
     * @param {Object} body Body
     */
    async getFulfillmentPreference (body) {
        var params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            },
            ProjectionExpression: `markets, fulfillment_options, product_retail_network,
            product_fulfillment_center, market_retail_network, market_fulfillment_center`
        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        return items[0];
    }

}
module.exports.FulfillmentHandler = async (event, context, callback) =>
    new Fulfillment().getFulfillment(event, context, callback);
