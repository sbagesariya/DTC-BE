const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetAlcoholType class
 * @author Innovify
 */
class GetAlcoholType {

    /**
     * @desc This function is being used to to get Alcohol Types
     * @author Innovify
     * @since 08/03/2021
     */
    async getAlcoholType () {
        try {
            var params = {
                TableName: 'Alcohol_type',
                AttributesToGet: ['id', 'name', 'order_n']
            };
            const data = await docClient.scan(params).promise();
            const alcoholData = data.Items;
            alcoholData.sort((a, b) => (a.order_n > b.order_n ? 1 : -1));
            alcoholData.map((obj) => {
                obj.id = obj.name;
                delete obj.order_n;
                return obj;
            });
            return Utils.successResponse(alcoholData);
        } catch (error) {
            Logger.error('getAlcoholType:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getAlcoholTypeHandler = async () => new GetAlcoholType().getAlcoholType();
