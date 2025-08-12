const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetOrderStatus class
 */
class GetOrderStatus {

    /**
     * @desc This function is being used to to get order status
     */
    async getOrderStatus () {
        try {
            var params = {
                TableName: 'Order_status',
                AttributesToGet: ['id', 'name', 'order_n']
            };
            const data = await docClient.scan(params).promise();
            const orderStatusData = data.Items;
            orderStatusData.sort((a, b) => (a.order_n > b.order_n ? 1 : -1));
            const result = [];
            orderStatusData.forEach(item => {
                result.push({
                    id: item.name,
                    name: item.name
                });
            });
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getOrderStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getOrderStatusHandler = async () => new GetOrderStatus().getOrderStatus();
