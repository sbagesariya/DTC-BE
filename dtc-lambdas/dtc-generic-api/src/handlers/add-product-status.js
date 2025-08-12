const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddProductStatus class
 */
class AddProductStatus {

    async addStatus (req, context, callback) {
        try {
            var params = {
                TableName: 'Products'
            };
            const products = await docClient.scan(params).promise();
            this.updateProductStatus(products.Items);
            return callback(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('addProductStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add product status
     * @param {*} products
     */
    updateProductStatus (products) {
        var params = {
            TableName: 'Products'
        };
        products.forEach(async (value) => {
            if (typeof value.price == 'undefined') {
                params.Key = { brand_id: value.brand_id, product_id: value.product_id };
                params.UpdateExpression = 'set product_status = :product_status';
                params.ExpressionAttributeValues = {
                    ':product_status': 0
                };
            } else {
                params.Key = { brand_id: value.brand_id, product_id: value.product_id };
                params.UpdateExpression = 'set product_status = :product_status';
                params.ExpressionAttributeValues = {
                    ':product_status': 1
                };
            }
            await docClient.update(params).promise();
        });
    }
}

module.exports.addProductStatusHandler = async (event, context, callback) => new AddProductStatus().addStatus(event, context, callback);
