const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Message = require('./../../utils/constant');

/**
 * @name ClearCart class
 */
class ClearCart {
    /**
     * @desc This function is being used to to user clear cart
     * @since 09/12/2020
     * @param {String} pathParameters.userId userId
     */
    async clearCart (event) {
        const params = {
            TableName: 'Cart',
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': event.pathParameters.userId
            }
        };
        const data = await docClient.query(params).promise();
        const item = data.Items;
        if (item && item.length) {
            const removeParams = {
                TableName: 'Cart',
                Key: {
                    'user_id': item[0].user_id,
                    'cart_id': item[0].cart_id
                }
            };
            await docClient.delete(removeParams).promise();
            return Utils.successResponse({});
        } else {
            return Utils.errorResponse(Message.CART.USER_NOT_FOUND);
        }
    }
}

module.exports.clearCartHandler = async (event) => new ClearCart().clearCart(event);
