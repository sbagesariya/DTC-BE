const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('../../utils/logger');

class Markets {

    async getMarkets () {
        try {
            const params = {
                TableName: 'Markets',
                AttributesToGet: ['id', 'name']
            };
            const marketsData = await docClient.scan(params).promise();
            const data = marketsData.Items;
            data.sort((a, b) => (a.name > b.name ? 1 : -1));
            return Utils.successResponse(data);
        } catch (error) {
            Logger.error('getMarkets:catch', error);
            return Utils.errorResponse(error);
        }
    }

}
module.exports.marketsHandler = async (event, context, callback) =>
    new Markets().getMarkets(event, context, callback);
