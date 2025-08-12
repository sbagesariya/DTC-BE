const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name UpdateOrderStatus class
 */
class UpdateOrderStatus {

    async updateOrderStatus (req, context, callback) {
        try {
            var params = {
                TableName: 'Order',
                FilterExpression: 'order_status = :order_status1 OR order_status = :order_status2',
                ExpressionAttributeValues: {
                    ':order_status1': 'Confirmed',
                    ':order_status2': 'Completed'
                }
            };
            const orders = await docClient.scan(params).promise();
            this.updateStatus(orders.Items);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('addProductStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update order status
     * @param {*} orders
     */
    updateStatus (orders) {
        var params = {
            TableName: 'Order'
        };
        orders.forEach(async (data) => {
            if (data.brand_id !== '' && data.createdAt !== '') {
                params.Key = { brand_id: data.brand_id, createdAt: data.createdAt };
                if (data.order_status === 'Confirmed') {
                    params.UpdateExpression = 'SET order_status = :order_status, search_status = :search_order_status';
                    params.ExpressionAttributeValues = {
                        ':order_status': 'Received',
                        ':search_order_status': 'received'
                    };
                    await docClient.update(params).promise();

                } else if (data.order_status === 'Completed') {
                    params.UpdateExpression = 'SET order_status = :order_status, search_status = :search_order_status';
                    params.ExpressionAttributeValues = {
                        ':order_status': 'Delivered',
                        ':search_order_status': 'delivered'
                    };
                    await docClient.update(params).promise();
                } else {
                    /** */
                }
                return true;
            }
        });
    }
}

module.exports.updateOrderStatusHandler = async (event, context, callback) => new UpdateOrderStatus().updateOrderStatus(event, context, callback);
