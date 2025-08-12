// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.PRODUCTS_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getProductListHandler = async () => {
    var params = {
        TableName: tableName
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items;
    // All log statements are written to CloudWatch
    return Utils.successResponse(items);
};
