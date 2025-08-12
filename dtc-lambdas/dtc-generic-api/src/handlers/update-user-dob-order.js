const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const dateFormat = require('dateformat');

/**
 * @name UpdateUserDOBOrder class
 */
class UpdateUserDOBOrder {

    async updateUserDOBOrder (req, context, callback) {
        try {
            var params = {
                TableName: 'Order'
            };
            const orders = await docClient.scan(params).promise();
            await this.updateData(orders.Items);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('addProductStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update user details DOB in orders table
     * @param {*} orders
     */
    async updateData (orders) {
        var params = {
            TableName: 'Order'
        };
        orders.forEach(async (data) => {
            if (data.brand_id !== '' && data.createdAt !== '') {
                Logger.info(':::::START::::::', data.brand_id);
                params.Key = { brand_id: data.brand_id, createdAt: data.createdAt };
                var DOB = '';
                if (data.user_detail.date_of_birth && data.user_detail.date_of_birth !== 'undefined-undefined-undefined') {
                    DOB = dateFormat(data.user_detail.date_of_birth, 'isoDate');
                } else {
                    var now = new Date();
                    DOB = dateFormat(now, 'isoDate');
                }
                params.UpdateExpression = 'SET user_detail.date_of_birth = :date_of_birth';
                params.ExpressionAttributeValues = {
                    ':date_of_birth': DOB
                };
                Logger.info(':::::params::::::', params);
                Logger.info(':::::END::::::', data.brand_id);
                await docClient.update(params).promise();
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        });
    }
}
module.exports.updateUserDOBOrderHandler = async (event, context, callback) =>
    new UpdateUserDOBOrder().updateUserDOBOrder(event, context, callback);
