const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const CommonService = require('./../services/common.service');
const Message = require('../../utils/message');
class FulfillmentProductInventory {

    /**
    * @desc This function is being used to to get fulfillment product inventory
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {Number} req.body.page page
    * @param {String} req.body.universal_search Universal Search
    * @param {Number} req.body.limit limit
    */
    async getInventory (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const result = await this.getInventoryProducts(body);
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('getInventory:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getInventory:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }


    /**
    * @desc This function is being used to get fulfillment product
    * @param {Object} req Request Body
    */
    async getInventoryProducts (req) {
        try {
            const limit = (!req.limit) ? 9 : req.limit;
            const offset = (req.page) ? ((req.page - 1) * limit) : 0;
            const client = await ElasticSearch.connection();
            var queryParams = [
                { match: { 'brand_id.keyword': req.brand_id } }
            ];
            const preference = await CommonService.getBrandFulfillmentPreference(req.brand_id,
                'fulfillment_options, product_fulfillment_center');
            const productTypes = preference.product_fulfillment_center;
            if (preference.fulfillment_options === 'product' && productTypes.length) {
                queryParams.push({ terms: { 'alcohol_type.keyword': productTypes } });
            }
            if (req.universal_search !== '') {
                const searchParam = {
                    bool: {
                        should: [
                            {
                                multi_match: {
                                    query: req.universal_search,
                                    type: 'phrase_prefix',
                                    fields: [ 'search_product_name', 'alcohol_type', 'search_sku_code', 'size', 'search_stock']
                                }
                            }
                        ]
                    }
                };
                queryParams.push(searchParam);
            }
            const { body } = await client.search({
                index: 'fulfillment-inv-index',
                body: {
                    _source: [
                        'product_name',
                        'alcohol_type',
                        'sku_code',
                        'size',
                        'stock',
                        'brand_id',
                        'fulfillment_center_id',
                        'createdAt'
                    ],
                    query: {
                        bool: {
                            must: queryParams
                        }
                    },
                    from: offset,
                    size: limit,
                    sort: [
                        { 'product_name.keyword': { 'order': 'asc' } }
                    ]

                }
            });
            const totalRecords = body.hits.total.value;
            const productData = [];
            if (totalRecords > 0) {
                body.hits.hits.map(products => {
                    productData.push(products._source);
                });
            }
            return { 'data': productData, 'result_count': productData.length, 'total_count': totalRecords };
        } catch (error) {
            Logger.error('getInventoryProducts:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.fulfillmentProductInventoryHandler = async (event, context, callback) =>
    new FulfillmentProductInventory().getInventory(event, context, callback);
