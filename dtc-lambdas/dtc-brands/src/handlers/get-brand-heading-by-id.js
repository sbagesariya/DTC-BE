const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');

/**
 * A simple example includes a HTTP get method to get one item by id from a DynamoDB table.
 */
exports.getBrandHeadingByIdHandler = async (event) => {
    const id = event.pathParameters.id;
    var params = {
        TableName: 'Brands',
        KeyConditionExpression: 'brand_id = :brand_id',
        ExpressionAttributeValues: {
            ':brand_id': id
        }
    };
    const data = await docClient.query(params).promise();
    const item = data.Items;

    return Utils.successResponse(item);
};
