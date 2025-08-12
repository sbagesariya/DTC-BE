const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const Constants = require('../../utils/constants');
const CommonService = require('./../services/common.service');
class ProductAvailability {

    /**
     * @desc This function is being used to check product availability
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brandId Brand Id
     * @param {String} req.body.productId Product Id
     * @param {String} req.body.postalCode Zipcode
     * @param {String} req.body.state State
     * @param {String} req.body.lat User lat
     * @param {String} req.body.lng User long
    */
    async checkProductAvailable (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const fulfillmentPreference = await CommonService.getFulfillmentPreference(body);
                const retailerId = await this.getClosestRetailer(body, fulfillmentPreference);
                const fulfillmentCenterId = await this.getFulfillmentCenter(body, fulfillmentPreference);
                if (retailerId || fulfillmentCenterId) {
                    if (body.productId) {
                        return this.getAvailableProduct(retailerId, fulfillmentCenterId, body, fulfillmentPreference, callback);
                    } else {
                        const result = {};
                        result.retailers = retailerId;
                        result.fulfillment_centers = fulfillmentCenterId;
                        return Utils.successResponse(result);
                    }
                } else {
                    return Utils.errorResponse(Message.PRODUCT.DELIVERY_NOT_AVAILABLE);
                }
            } catch (error) {
                Logger.error('checkProductAvailable:catch', error);
                return Utils.errorResponse(undefined, error);
            }
        }).catch((err) => {
            Logger.error('checkProductAvailable:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brandId) {
                reject(Message.PRODUCT.BRAND_ID_REQUIRED);
            } else if (!body.state) {
                reject(Message.PRODUCT.STATE_REQUIRED);
            } else if (!body.postalCode) {
                reject(Message.PRODUCT.POSTAL_CODE_REQUIRED);
            } else if (!body.lat) {
                reject(Message.PRODUCT.LAT_IS_REQUIRED);
            } else if (!body.lng) {
                reject(Message.PRODUCT.LONG_IS_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to get closest retailers data
    * @param {Object} body body
    */
    async getClosestRetailer (body, fulfillmentPreference) {
        const parmas = {
            TableName: 'Retailers_addresses',
            FilterExpression: `is_shipping_limit = :is_shipping_limit AND
                (shipping_limit.zipcode = :zipcode OR (shipping_limit.zipcode = :nozipcode AND #shipping_limit.#state = :state_name))`,
            ExpressionAttributeValues: {
                ':is_shipping_limit': true,
                ':zipcode': body.postalCode,
                ':nozipcode': '',
                ':state_name': body.state
            },
            ExpressionAttributeNames: {
                '#shipping_limit': 'shipping_limit',
                '#state': 'state'
            },
            ProjectionExpression: 'retailer_id, shipping_limit'
        };
        const retailersAddresses = await docClient.scan(parmas).promise();
        let retailers = this.checkFulfillmentPreference(retailersAddresses.Items, fulfillmentPreference);
        if (!body.productId) {
            retailers = await this.checkRetailerStock(retailers, body.brandId);
        }
        return retailers;
    }

    /**
    * @desc This function is being used to get retailer/fulfillment product
    * @param {String} retailerId retailerId
    * @param {String} fulfillmentCenterId fulfillmentCenterId
    * @param {Object} req body data
    * @param {Object} fulfillmentPreference Fulfillment preferences Market/Product type
    * @param {callback/function} callback callback function
    */
    async getAvailableProduct (retailers, fulfillmentCenterId, req, fulfillmentPreference, callback) {
        try {
            var queryParams = [
                { match: { 'brand_id.keyword': req.brandId } },
                { range: { 'stock': { gt: 0 } } },
                { match: { 'product_id.keyword': req.productId } }
            ];
            var fulfillmentQueryParams = JSON.parse(JSON.stringify(queryParams));
            let retailerProductType = [];
            let fulfillmentProductType = [];
            if (fulfillmentPreference.fulfillment_options === Constants.FULFILLMENT_OPTION.PRODUCT) {
                retailerProductType = fulfillmentPreference.product_retail_network;
                queryParams.push({ terms: { 'alcohol_type.keyword': retailerProductType } });
                fulfillmentProductType = fulfillmentPreference.product_fulfillment_center;
                fulfillmentQueryParams.push({ terms: { 'alcohol_type.keyword': fulfillmentProductType } });
            }
            var mainQuery = [];
            if (retailers && retailers.length) {
                queryParams.push({ terms: { 'retailer_id.keyword': retailers } });
                mainQuery.push({
                    bool:
                    {
                        must: queryParams,
                        filter: {
                            term: {
                                _index: 'inventory-index'
                            }
                        }
                    }
                });
            }
            if (fulfillmentCenterId) {
                fulfillmentQueryParams.push({ terms: { 'fulfillment_center_id.keyword': fulfillmentCenterId } });
                fulfillmentQueryParams.push({ match: { 'unit_price_per_market.states.name': req.state } });
                mainQuery.push({
                    bool:
                    {
                        must: fulfillmentQueryParams,
                        filter: {
                            term: {
                                _index: 'fulfillment-inv-index'
                            }
                        }
                    }
                });
            }
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                body: {
                    _source: [
                        'product_id',
                        'retailer_id',
                        'fulfillment_center_id',
                        'brand_name',
                        'unit_price',
                        'brand_id',
                        'shipping',
                        'stock',
                        'createdAt',
                        'unit_price_per_market'
                    ],
                    query: {
                        bool:
                        {
                            should: mainQuery
                        }
                    },
                    collapse: {
                        field: 'product_id.keyword',
                        inner_hits: {
                            name: 'most_recent',
                            size: 100,
                            'sort': [{ 'unit_price': 'asc' }]
                        }
                    },
                    sort: [
                        { 'product_id.keyword': { 'order': 'asc' } }
                    ]
                }
            });
            let inventory = {};
            let variants = [];
            const totalRecords = body.hits.total.value;
            if (totalRecords > 0) {
                body.hits.hits.forEach(products => {
                    variants = [];
                    products.inner_hits.most_recent.hits.hits.forEach(variant => {
                        if ((variants.findIndex(obj => obj.size === variant._source.size)) === -1) {
                            let price = [];
                            if (variant._source.unit_price_per_market) {
                                price = variant._source.unit_price_per_market.filter(x =>
                                    x.states.find(y => y.name === req.state ));
                            }
                            variants.push({
                                size: variant._source.size,
                                price: price.length ? price[0].rate : variant._source.unit_price,
                                retailer_id: variant._source.retailer_id,
                                fulfillment_center_id: variant._source.fulfillment_center_id,
                                stock: variant._source.stock,
                                sku_code: variant._source.sku_code || null
                            });
                        }
                    });
                    variants.sort((a, b) => a.price - b.price);
                    inventory = products._source;
                    inventory.matrix = variants;
                    inventory.retailers = retailers;
                    inventory.fulfillment_centers = fulfillmentCenterId;
                });
                return callback(null, Utils.successResponse(inventory,
                    Message.PRODUCT.DELIVERY_AVAILABLE
                ));
            } else {
                return Utils.errorResponse(Message.PRODUCT.DELIVERY_NOT_AVAILABLE);
            }
        } catch (error) {
            Logger.error('getAvailableProduct:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to get sum of stock
     *
     * @param {String} retailerId
     * @param {String} brandId
     */
    async getSumOfStockFromES (retailerId, brandId) {
        try {
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                index: 'inventory-index',
                body: {
                    _source: [
                        'stock'
                    ],
                    query: {
                        bool:
                        {
                            must:
                            [
                                { match: { 'retailer_id.keyword': retailerId } },
                                { match: { 'brand_id.keyword': brandId } },
                                { range: { 'stock': { gt: 0 } } }
                            ]
                        }
                    },
                    aggs: {
                        total_stock: { 'sum': { 'field': 'stock' } }
                    }
                }
            });
            return body.aggregations.total_stock.value;
        } catch (error) {
            Logger.error('getSumOfStockFromES:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to check fulfillment preference
     * @since 28/09/2021
     * @param {Object} item Item
     * @param {Array} fulfillmentPreference Fulfillment Preference
     * @param {String} type Type
     */
    checkFulfillmentPreference (items, fulfillmentPreference, type = Constants.REQUEST_TYPE.RETAILER) {
        let retailerFCIds = [];
        if (fulfillmentPreference.fulfillment_options === Constants.FULFILLMENT_OPTION.MARKET) {
            items.forEach((item) => {
                if (type === Constants.REQUEST_TYPE.RETAILER) {
                    let retailerMarketType = fulfillmentPreference.market_retail_network;
                    retailerMarketType = retailerMarketType.map( el => el.name );
                    const state = (item.shipping_limit) ? item.shipping_limit.state : item.primary_address.state_fullname;
                    if (retailerMarketType.includes(state)) {
                        retailerFCIds.push(item.retailer_id);
                    }
                } else {
                    // FS primary address should be available in FS preference markets(state) if set
                    let fulfillmentMarketType = fulfillmentPreference.market_fulfillment_center;
                    fulfillmentMarketType = fulfillmentMarketType.map( el => el.name );
                    const state = item.primary_address.state;
                    if (fulfillmentMarketType.includes(state)) {
                        retailerFCIds.push(item.fulfillment_center_id);
                    }
                }
            });
        } else {
            retailerFCIds = items.map(obj => obj.retailer_id || obj.fulfillment_center_id);

        }
        return retailerFCIds;
    }

    /**
    * @desc This function is being used to get fulfillment center
    * @param {Object} body body
    */
    async getFulfillmentCenter (body, fulfillmentPreference) {
        const parmas = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: '(attribute_exists(primary_address.zipcode) AND primary_address.zipcode = :zipcode)',
            ExpressionAttributeValues: {
                ':brand_id': body.brandId,
                ':zipcode': body.postalCode
            },
            ProjectionExpression: 'fulfillment_center_id, primary_address'
        };
        let data = await docClient.query(parmas).promise();
        if (data.Count === 0) {
            parmas.FilterExpression = `(attribute_not_exists(primary_address.zipcode) OR primary_address.zipcode = :zipcode)
                AND #primary_address.#state = :state_name`;
            parmas.ExpressionAttributeValues[':state_name'] = body.state;
            parmas.ExpressionAttributeValues[':zipcode'] = '';
            parmas.ExpressionAttributeNames = {
                '#primary_address': 'primary_address',
                '#state': 'state'
            };
            data = await docClient.query(parmas).promise();
        }
        const fulfillmentCenterId = this.checkFulfillmentPreference(data.Items, fulfillmentPreference, Constants.REQUEST_TYPE.FULFILLMENT);
        return fulfillmentCenterId;
    }

    /**
     * Function to get check available Product From ES
     *
     * @param {Object} req Request
     * @param {Array} distanceData
     * @param {String} retailerId
     */
    async checkAvailableProductFromES (req, distanceData, retailerId) {
        try {
            const client = await ElasticSearch.connection();
            for (const i in distanceData) {
                if (Object.hasOwnProperty.call(distanceData, i)) {
                    const { body } = await client.search({
                        index: 'inventory-index',
                        body: {
                            _source: [
                                'stock'
                            ],
                            query: {
                                bool:
                                {
                                    must:
                                    [
                                        { match: { 'brand_id.keyword': req.brandId } },
                                        { range: { 'stock': { gt: 0 } } },
                                        { match: { 'retailer_id.keyword': distanceData[i].retailer_id } },
                                        { match: { 'product_id.keyword': req.productId } }
                                    ]
                                }
                            },
                            aggs: {
                                total_stock: { 'sum': { 'field': 'stock' } }
                            }
                        }
                    });
                    const stock = body.aggregations.total_stock.value;
                    if (stock > 0) {
                        return distanceData[i].retailer_id;
                    }
                }
            }
            return retailerId;
        } catch (error) {
            Logger.error('checkAvailableProductFromES:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to check retailer stock
     * @since 09/02/2022
     * @param {Array} distanceData Distance Data
     * @param {String} brandId brandId
     */
    async checkRetailerStock (distanceData, brandId) {
        const finalRetailers = [];
        for (const i in distanceData) {
            if (Object.hasOwnProperty.call(distanceData, i)) {
                const retailerStock = await this.getSumOfStockFromES(distanceData[i], brandId);
                if (retailerStock > 0) {
                    finalRetailers.push(distanceData[i]);
                }
            }
        }
        return finalRetailers;
    }
}
module.exports.ProductAvailabilityHandler = async (event, context, callback) =>
    new ProductAvailability().checkProductAvailable(event, context, callback);
