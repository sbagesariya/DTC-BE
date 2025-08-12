const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetVariantByProductId {

    /**
     * @desc This function is being used to to get variant by product id
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.product_id Product Id
     * @param {String} req.body.limit Limit
     * @param {String} req.body.order Order By
     * @param {String} req.body.sort Sort Order
     * @param {String} req.body.lastKey LastKey
     */
    async getVariantByProductId (req, context, callback) {
        const body = JSON.parse(req.body);
        const limit = body.limit || 5;
        if (!body.product_id) {
            return Utils.errorResponse(Message.PRODUCT.PRODUCT_ID_REQUIRED);
        }
        try {
            const params = {
                TableName: 'Size_variants',
                KeyConditionExpression: 'product_id = :product_id',
                ExpressionAttributeValues: {
                    ':product_id': body.product_id
                },
                ProjectionExpression: 'variant_id, product_id, variant_size, variant_type, upc_code, sku_code',
                Limit: limit
            };
            this.prepareQuery(body, params);
            const Limit = limit;
            const scanResults = [];
            let variantData;
            do {
                variantData = await docClient.query(params).promise();
                const items = variantData.Items;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    scanResults.push(item);
                }
                params.ExclusiveStartKey = variantData.LastEvaluatedKey;
                params.Limit = Limit - scanResults.length;
            } while (scanResults.length < Limit && variantData.LastEvaluatedKey);
            return callback(null, Utils.successResponse({
                data: scanResults,
                total_count: await this.getTotalVariantCount(body.product_id),
                lastKey: variantData.LastEvaluatedKey || '',
                result_count: variantData.Count
            }));
        } catch (error) {
            Logger.error('getVariant:catch', error);
            return Utils.errorResponse(error);
        }
    }

    prepareQuery (body, params) {
        if (body.order && body.order !== '') {
            params.ScanIndexForward = (body.order === 'asc');
        }
        if (body.sort && body.sort !== '') {
            const sort = body.sort;
            params.IndexName = `product_id-${sort}-index`;
        }
        if (body.lastKey) {
            params.ExclusiveStartKey = body.lastKey;
        }
    }

    /**
    * @desc This function is being used to get total variant count
    * @param {String} productId Product Id
    */
    async getTotalVariantCount (productId) {
        const params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': productId
            },
            Select: 'COUNT'
        };
        const variantData = await docClient.query(params).promise();
        return variantData.Count;
    }
}

module.exports.getVariantByProductIdHandler = async (event, context, callback) =>
    new GetVariantByProductId().getVariantByProductId(event, context, callback);
