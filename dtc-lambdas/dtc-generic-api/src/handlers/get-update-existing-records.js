const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
/**
 * @name GetUpdateExistingRecords class
 * @author GrowExx
 */
class GetUpdateExistingRecords {

    /**
     * @desc This function is being used to get & update records table
     */
    async getUpdateExistingRecords (req, context, callback) {
        try {
            await this.getUpdateTableRecords('Fulfillment_inventory');
            await this.getUpdateTableRecords('Inventory');
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('getUpdateExistingRecords:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async getUpdateTableRecords (tableName) {
        const params = {
            TableName: tableName
        };
        const resultData = await docClient.scan(params).promise();
        const data = resultData.Items;
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                const query = {
                    TableName: 'Products',
                    FilterExpression: 'product_id = :product_id',
                    ExpressionAttributeValues: {
                        ':product_id': element.product_id
                    }
                };
                const product = await docClient.scan(query).promise();
                if (product.Items.length) {
                    element.description = product.Items[0].description || '';
                    params.Item = element;
                    await docClient.put(params).promise();
                }
            }
        }
    }
}
module.exports.GetUpdateExistingRecordsHandler = async (event, context, callback) =>
    new GetUpdateExistingRecords().getUpdateExistingRecords(event, context, callback);
