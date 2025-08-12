/**
 * @desc Class represent generic function to post item into table
 * @since 10/12/2020
 */
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('./../../utils/logger');
const Async = require('async');
class AddProductDataToSizeVariant {

    /**
     * @desc This function is being used to add product data to size variant table
     * @since 22/04/2020
     */
    async addProductDataToSizeVariant (event, content, cb) {
        try {
            var params = {
                TableName: 'Size_variants',
                limit: 20
            };
            const SizeVariants = await docClient.scan(params).promise();
            const products = SizeVariants.Items;
            Async.forEach(products, async (item, callback) => {
                const query = {
                    TableName: 'Products',
                    FilterExpression: 'product_id = :product_id',
                    ExpressionAttributeValues: {
                        ':product_id': item.product_id
                    }
                };
                const product = await docClient.scan(query).promise();
                if (product.Items.length) {
                    await this.updateSizeVariant(item, product.Items[0]);
                }
                callback();
            }, (err)=> {
                Logger.error('iterating done', err);
            });
            return cb(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('addProductStatus:catch', error);
            return Utils.errorResponse(error);
        }
    }
    async updateSizeVariant (item, result) {
        const udpateQuery = {
            TableName: 'Size_variants',
            Key: { product_id: item.product_id, variant_id: item.variant_id },
            UpdateExpression: 'SET brand_id = :brand_id, product_name = :product_name, alcohol_type = :alcohol_type',
            ExpressionAttributeValues: {
                ':brand_id': result.brand_id,
                ':product_name': result.product_name,
                ':alcohol_type': result.alcohol_type
            }
        };
        return await docClient.update(udpateQuery).promise();
    }
}

module.exports.AddProductDataToSizeVariantHandler = async (event, content, callback) =>
    new AddProductDataToSizeVariant().addProductDataToSizeVariant(event, content, callback);
