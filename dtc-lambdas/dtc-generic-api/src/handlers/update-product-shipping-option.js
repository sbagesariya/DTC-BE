const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name UpdateProductShippingOption class
 */
class UpdateProductShippingOption {

    async updateProductShippingOption (req, context, callback) {
        try {
            await this.updateShippingOption('Products');
            await this.updateShippingOption('Saved_products');
            await this.updateShippingOption('Inventory');
            await this.updateShippingOption('Fulfillment_inventory');
            return callback(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('updateProductShippingOption:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update product Shipping Option
     * @param {*} tableName
     */
    async updateShippingOption (tableName) {
        var params = {
            TableName: tableName
        };
        const result = await docClient.scan(params).promise();
        if (result.Items.length) {
            result.Items.forEach(async (items) => {
                items.shipping = ['Ground Shipping'];
                const updateParams = {
                    TableName: tableName,
                    Item: items
                };
                await docClient.put(updateParams).promise();
            });
        }
    }
}

module.exports.updateProductShippingOptionHandler = async (event, context, callback) =>
    new UpdateProductShippingOption().updateProductShippingOption(event, context, callback);
