
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
class GetProductsByBrand {

    /**
    * @desc This function is being used to to get products by brand
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.retailer_id Retailer Id
    */
    async getProductsByBrand (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const limit = body.limit || 6;
                const products = await this.getInventoryProducts(body.retailer_id, body.brand_id);
                let params = {
                    TableName: 'Size_variants',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    },
                    IndexName: 'brand_id-product_name-index',
                    Limit: limit
                };
                if (products.length) {
                    params = this.prepareQuery(products, params);
                }
                const Limit = limit;
                if (body.lastKey) {
                    params.ExclusiveStartKey = body.lastKey;
                }
                const scanResults = [];
                let items;
                let resultCount = 0;
                do {
                    items = await docClient.query(params).promise();
                    items.Items.forEach((item) => scanResults.push(item));
                    params.ExclusiveStartKey = items.LastEvaluatedKey;
                    params.Limit = Limit - scanResults.length;
                    resultCount += items.Count;
                } while (scanResults.length < Limit && items.LastEvaluatedKey);
                return callback(null, Utils.successResponse({
                    data: scanResults,
                    lastKey: items.LastEvaluatedKey || '',
                    total_count: await this.getTotalProductCount(params),
                    result_count: resultCount
                }));
            } catch (error) {
                Logger.error('getProductsByBrand:catch', error);
                return callback(null, Utils.errorResponse(error));
            }

        }).catch((err) => {
            Logger.error('getProductsByBrand:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to prepare the query
    * @param {Array} products products
    * @param {Object} params params
    */
    prepareQuery (products, params) {
        params.FilterExpression = '';
        for (let i = 0; i < products.length; i++) {
            const attribute = products[i];
            if (attribute.size) {
                const size = attribute.size.replace(/[^0-9]/g, '');
                params.FilterExpression += `(not (product_id = :product_id${i} AND variant_size = :size${i}))`;
                params.ExpressionAttributeValues[`:product_id${i}`] = attribute.product_id;
                params.ExpressionAttributeValues[`:size${i}`] = parseInt(size);
                if (i !== products.length - 1) {
                    params.FilterExpression += ' AND ';
                }
            }
        }
        return params;
    }

    /**
    * @desc This function is being used to get all current products
    * @param {String} req.body.retailerId Retailer Id
    * @param {String} req.body.brandId Brand Id
    */
    async getInventoryProducts (retailerId, brandId) {
        const params = {
            TableName: 'Inventory',
            IndexName: 'brand_id-index',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'retailer_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': retailerId,
                ':brand_id': brandId
            },
            ProjectionExpression: 'product_id, size'
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }

    /**
    * @desc This function is being used to validate get products by brand request
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.retailer_id Retailer Id
    */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.retailer_id) {
                reject(Message.RETAILER_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to get total product count
    * @param {Object} params params
    */
    async getTotalProductCount (params) {
        delete params.ProjectionExpression;
        delete params.Limit;
        delete params.ExclusiveStartKey;
        delete params.ScanIndexForward;
        params.Select = 'COUNT';
        const orderData = await docClient.query(params).promise();
        return orderData.Count;
    }
}
module.exports.getProductsByBrandHandler = async (event, context, callback) =>
    new GetProductsByBrand().getProductsByBrand(event, context, callback);
