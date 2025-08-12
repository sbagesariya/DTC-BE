const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name UpdateSkuCode class
 * @author GrowExx
 */
class UpdateSkuCode {

    async updateSkuCode (req, context, callback) {
        try {
            this.updateRecords('Size_variants');
            this.updateRecords('Inventory');
            this.updateRecords('Fulfillment_inventory');
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('updateSkuCode:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update sku code
     * @param {*} items
     */
    async updateRecords (tableName) {
        var params = {
            TableName: tableName,
            FilterExpression: 'attribute_exists(sku_code)'
        };
        const result = await docClient.scan(params).promise();
        if (result.Items.length) {
            result.Items.forEach(async (data) => {
                data.sku_code = (data.sku_code).toString();
                var params = {
                    TableName: tableName,
                    Item: data
                };
                docClient.put(params).promise();
            });
        }
    }
}
module.exports.UpdateSkuCodeHandler = async (req, context, callback) =>
    new UpdateSkuCode().updateSkuCode(req, context, callback);
