const Utils = require('./../../utils/lambda-response');
const Logger = require('../../utils/logger');
const ParameterStore = require('../../utils/ssm');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetProductsByBrand {
    /**
   * @desc This function is being used to to get all products
   * @param {Object} req Request
   * @param {Object} req.body RequestBody
   * @param {String} req.body.brand_id Brand Id
   */
    async getProductsByBrand (req, context, callback) {
        const body = JSON.parse(req.body);
        let limit = body.limit || 6;
        if (!body.brand_id) {
            return Utils.errorResponse('Brand id is required');
        }
        try {
            limit = (body.is_cms) ? 'ALL' : limit;
            const params = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id
                },
                Limit: limit
            };
            this.prepareQuery(body, params);
            const Limit = limit;
            const scanResults = [];
            let productData;
            do {
                productData = await docClient.query(params).promise();
                await this.prepareScanResults(productData, scanResults, body);
                params.ExclusiveStartKey = productData.LastEvaluatedKey;
                params.Limit = Limit - scanResults.length;
            } while (scanResults.length < Limit && productData.LastEvaluatedKey);
            return callback(null, Utils.successResponse({
                data: scanResults,
                total_count: (body.is_cms) ? productData.Count : await this.getTotalProductCount(body.brand_id),
                lastKey: productData.LastEvaluatedKey || '',
                result_count: productData.Count
            }));
        } catch (error) {
            Logger.error('getCmsProducts:catch', error);
            return Utils.errorResponse(error);
        }
    }

    hasProductImages (item, BucketURL) {
        if (Object.prototype.hasOwnProperty.call(item, 'product_images') && typeof item.product_images !== 'undefined') {
            const productImages = item.product_images;
            Object.keys(productImages).forEach(async (key) => {
                var val = productImages[key];
                productImages[key] = `${BucketURL}/` + val;
            });
        }
    }

    prepareQuery (body, params) {
        if (body.universal_search && body.universal_search !== '') {
            params.FilterExpression = 'contains(search_product_name, :search_product_name)';
            params.ExpressionAttributeValues[':search_product_name'] = (body.universal_search).toLowerCase();
            if (body.is_cms) {
                params.FilterExpression += ' AND product_status > :product_status';
                params.ExpressionAttributeValues[':product_status'] = 0;
            }
        }
        if (body.order && body.order !== '') {
            params.ScanIndexForward = (body.order === 'asc');
        }
        if (body.sort && body.sort !== '') {
            const sort = body.sort;
            params.IndexName = `brand_id-${sort}-index`;
        }
        if (body.lastKey) {
            params.ExclusiveStartKey = body.lastKey;
        }
        if (!body.is_cms) {
            params.ProjectionExpression = `brand_id, search_product_name, product_id, product_name, featured,
            availability_count, variants_count, product_images, product_status, is_catalog_product`;
        }
    }

    /**
    * @desc This function is being used to get total product count
    */
    async getTotalProductCount (brandId) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            Select: 'COUNT'
        };
        const productData = await docClient.query(params).promise();
        return productData.Count;
    }

    /**
    * @desc This function is being used to get product variant
    * @param {String} productId Product Id
    */
    async getProductVariants (productId) {
        const params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': productId
            },
            ProjectionExpression: 'variant_size, variant_type'
        };
        const variantData = await docClient.query(params).promise();
        return variantData.Items;
    }

    /**
    * @desc This function is being used to prepare price matrix
    * @param {Array} variantSize variant size
    */
    async preparePriceMatrix (variantSize) {
        const priceMatrix = {
            ground_shipping: {},
            scheduled_delivery: {}
        };
        const price = 11 + 2;
        variantSize.forEach(async (value, key) => {
            const size = `${value.variant_size}_${value.variant_type}`;
            priceMatrix.ground_shipping[size] = price + 1 + key;
            priceMatrix.scheduled_delivery[size] = price + 15 + key;
        });
        return priceMatrix;
    }

    /**
    * @desc This function is being used to prepare scan results data
    * @param {Array} productData
    * @param {Array} scanResults
    * @param {Object} body
    */
    async prepareScanResults (productData, scanResults, body) {
        const items = productData.Items;
        const BucketURL = await ParameterStore.getValue('buket_url');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            this.hasProductImages(item, BucketURL);
            if (body.is_cms) {
                item.size = await this.getProductVariants(item.product_id);
                item.price_matrix = await this.preparePriceMatrix(item.size);
            }
            scanResults.push(item);
        }
    }
}
module.exports.getCmsProductsByBrandIdHandler = async (event, context, callback) =>
    new GetProductsByBrand().getProductsByBrand(event, context, callback);
