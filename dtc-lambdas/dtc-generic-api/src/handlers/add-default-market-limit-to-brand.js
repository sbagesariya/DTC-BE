const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddDefaultMarketLimit class
 */
class AddDefaultMarketLimit {

    async getBrands (req, context, callback) {
        try {
            var params = {
                TableName: 'Portal_users',
                FilterExpression: 'user_type = :type',
                ExpressionAttributeValues: {
                    ':type': 'brand'
                }
            };
            const users = await docClient.scan(params).promise();
            this.addMarketLimit(users.Items);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('addProductStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update defaut market limit
     * @param {*} users
     */
    addMarketLimit (users) {
        var params = {
            TableName: 'Portal_users'
        };
        users.forEach(async (data) => {
            params.Key = { email: data.email };
            params.UpdateExpression = 'SET max_market_count = :default_limit, max_product_count =:default_product_limit ';
            params.ExpressionAttributeValues = {
                ':default_limit': 5,
                ':default_product_limit': 20
            };
            await docClient.update(params).promise();
        });
    }
}

module.exports.addDefaultMarketLimitHandler = async (event, context, callback) => new
AddDefaultMarketLimit().getBrands(event, context, callback);
