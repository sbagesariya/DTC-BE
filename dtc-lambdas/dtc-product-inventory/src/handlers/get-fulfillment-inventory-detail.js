const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const Message = require('./../../utils/message');
const CommonService = require('./../services/common.service');
class GetfulfillmentInventory {

    /**
    * @desc This function is being used to to get fulfillment product inventory detail
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.CREATED_AT Created At date
    * @param {String} req.body.fulfillment_center_id Fulfillment Center Id
    */
    async getfulfillmentInventory (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const result = await this.getInventoryProductDetail(body);
                if (result.brand_id) {
                    const preference = await CommonService.getBrandFulfillmentPreference(result.brand_id);
                    if (Object.keys(preference).length !== 0 && preference.fulfillment_options === 'market') {
                        result.markets = preference.market_fulfillment_center;
                    } else {
                        result.markets = preference.markets;
                    }
                }
                return Utils.successResponse([result]);
            } catch (error) {
                Logger.error('getfulfillmentInventory:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getfulfillmentInventory:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate get fulfillment product inventory detail
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.CREATED_AT Created At date
    * @param {String} req.body.fulfillment_center_id Fulfillment Center Id
    */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.created_at) {
                reject(Message.CREATED_AT);
            } else if (!body.fulfillment_center_id) {
                reject(Message.FULFILLMENT_CENTER_ID_REQUIRE);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to get fulfillment product details
    * @param {Object} req Request Body
    */
    async getInventoryProductDetail (req) {
        try {
            const client = await ElasticSearch.connection();
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
                        'unit_price_per_market',
                        'createdAt'
                    ],
                    query: {
                        bool:
                        {
                            must:
                            [
                                { match: { 'fulfillment_center_id.keyword': req.fulfillment_center_id } },
                                { match: { 'createdAt': req.created_at } }
                            ]
                        }
                    }
                }
            });
            const totalRecords = body.hits.total.value;
            let productData = [];
            if (totalRecords > 0) {
                productData = body.hits.hits[0]._source;
            }
            return productData;
        } catch (error) {
            Logger.error('getInventoryProducts:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.GetfulfillmentInventoryDetailHandler = async (event, context, callback) =>
    new GetfulfillmentInventory().getfulfillmentInventory(event, context, callback);
