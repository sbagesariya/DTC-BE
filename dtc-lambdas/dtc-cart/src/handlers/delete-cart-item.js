const Utils = require('../../utils/lambda-response');
const Message = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.deleteCartItemHandler = async (event) => {
    var params = {
        TableName: 'Cart',
        Key: {
            user_id: event.pathParameters.userid,
            cart_id: event.pathParameters.carttid
        }
    };
    await docClient.delete(params).promise();
    return Utils.successResponse(null, Message.CART.ITEM_DELETED);
};
