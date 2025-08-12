const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const ParameterStore = require('../../utils/ssm');
const CommonService = require('./../services/common.service');
const Constants = require('./../../utils/constants');
class GetProductsDetail {

    /**
     * @desc This function is being used to to get product details
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brandid Brand Id
     * @param {String} req.body.productid product Id
     * @param {String} req.body.iscms iscms
     * @param {String} req.body.template_id template_id
     */
    async getProductsDetail (req) {
        const body = JSON.parse(req.body);
        var params;
        if (body.iscms) {
            params = {
                TableName: 'Saved_products',
                KeyConditionExpression: 'brand_id = :brand_id',
                FilterExpression: 'product_id = :product_id AND template_id = :template_id',
                ExpressionAttributeValues: {
                    ':product_id': body.productid,
                    ':brand_id': body.brandid,
                    ':template_id': body.template_id
                }
            };
        } else {
            params = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                ExpressionAttributeValues: {
                    ':product_id': body.productid,
                    ':brand_id': body.brandid
                }
            };
        }
        const data = await docClient.query(params).promise();
        const item = data.Items;
        if (data.Count > 0) {
            if (Object.prototype.hasOwnProperty.call(item[0], 'product_images') && typeof item[0].product_images != 'undefined') {
                const productImages = item[0].product_images;
                const BucketURL = await ParameterStore.getValue('buket_url');
                Object.keys(productImages).forEach(async (key) => {
                    var val = productImages[key];
                    productImages[key] = `${BucketURL}/` + val;
                });
            }
            const inventoryES = await this.getPriceRangeFromES(body);
            item[0].price_range = inventoryES.priceRange;
            item[0].matrix = inventoryES.matrix;
            item[0].retailer_id = inventoryES.retailerId;
            item[0].createdAt = inventoryES.createdAt;
            item[0].fulfillment_center_id = inventoryES.fulfillmentId;
        }
        return Utils.successResponse(item);
    }

    /**
     * Function to get price range from ElasticSearch
     *
     * @param {String} productId
     */
    async getPriceRangeFromES (req) {
        try {
            const fulfillmentPreference = await CommonService.getFulfillmentPreference(req);
            const retailer = [
                { match: { 'brand_id.keyword': req.brandid } },
                { match: { 'product_id.keyword': req.productid } },
                { terms: { 'retailer_id.keyword': req.retailers || [] } },
                { range: { 'stock': { gt: 0 } } }
            ];
            const fulfillment = [
                { match: { 'brand_id.keyword': req.brandid } },
                { match: { 'product_id.keyword': req.productid } },
                { match: { 'unit_price_per_market.states.name': req.state || [] } },
                { terms: { 'fulfillment_center_id.keyword': req.fulfillment_centers || [] } },
                { range: { 'stock': { gt: 0 } } }
            ];
            if (fulfillmentPreference.fulfillment_options === Constants.FULFILLMENT_OPTION.PRODUCT) {
                retailer.push({ terms: { 'alcohol_type.keyword': fulfillmentPreference.product_retail_network } });
                fulfillment.push({ terms: { 'alcohol_type.keyword': fulfillmentPreference.product_fulfillment_center } });
            }
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                body: {
                    _source: [
                        'unit_price',
                        'price',
                        'size',
                        'sku_code',
                        'retailer_id',
                        'fulfillment_center_id',
                        'stock',
                        'createdAt',
                        'unit_price_per_market'
                    ],
                    query: {
                        bool:
                        {
                            should: [
                                {
                                    bool:
                                    {
                                        must: retailer,
                                        filter: {
                                            term: {
                                                _index: 'inventory-index'
                                            }
                                        }
                                    }
                                },
                                {
                                    bool:
                                    {
                                        must: fulfillment,
                                        filter: {
                                            term: {
                                                _index: 'fulfillment-inv-index'
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    aggs: {
                        max_price: { 'max': { 'field': 'unit_price' } },
                        min_price: { 'min': { 'field': 'unit_price' } }
                    },
                    sort: [{ 'unit_price': 'asc' }]
                }
            });
            const variants = [];
            let retailerId;
            let fulfillmentId;
            let createdAt;
            body.hits.hits.forEach(products => {
                if ((variants.findIndex(obj => obj.size === products._source.size)) === -1) {
                    let price = [];
                    if (products._source.unit_price_per_market) {
                        price = products._source.unit_price_per_market.filter(x =>
                            x.states.find(y => y.name === req.state ));
                    }
                    variants.push({
                        size: products._source.size,
                        price: price.length ? price[0].rate : products._source.unit_price,
                        stock: products._source.stock,
                        retailer_id: products._source.retailer_id,
                        fulfillment_center_id: products._source.fulfillment_center_id,
                        sku_code: products._source.sku_code || null
                    });
                }
            });
            const totalRecords = body.hits.total.value;
            if (totalRecords > 0) {
                retailerId = body.hits.hits[0]._source.retailer_id;
                createdAt = body.hits.hits[0]._source.createdAt;
                fulfillmentId = body.hits.hits[0]._source.fulfillment_center_id;
                variants.sort((a, b) => a.price - b.price);
            }
            return { priceRange: body.aggregations, matrix: variants, retailerId, createdAt, fulfillmentId };
        } catch (error) {
            Logger.error('addSearchFieldData:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getProductsDetailHandler = async (event) =>
    new GetProductsDetail().getProductsDetail(event);
