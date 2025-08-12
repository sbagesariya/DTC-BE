const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Message = require('./../../utils/constant');

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.updateCartItemHandler = async (event) => {
    const body = JSON.parse(event.body);
    var params = {
        TableName: 'Cart',
        Key: {
            user_id: body.userid,
            cart_id: body.cartid
        },
        UpdateExpression: 'SET #qty =:qty',
        ExpressionAttributeNames: {
            '#qty': 'qty'
        },
        ExpressionAttributeValues: {
            ':qty': body.qty
        },
        ReturnValues: 'ALL_NEW'
    };
    const result = await docClient.update(params).promise();
    return Utils.successResponse(result, Message.CART.ITEM_UPDATED);
};
