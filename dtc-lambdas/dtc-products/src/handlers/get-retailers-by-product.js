const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('./../../utils/logger');
const Message = require('../../utils/message');
const ElasticSearch = require('../../utils/es-config');
const geolib = require('geolib');
const CommonService = require('./../services/common.service');

class GetRetailersByProduct {

    /**
     * @desc This function is being used to get Retailers by product
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.product_id Product Id
     * @param {String} req.body.size size
     * @param {String} req.body.qty Qty
     * @param {String} req.body.postalCode Zipcode
     * @param {String} req.body.state State
     * @param {String} req.body.lat User lat
     * @param {String} req.body.lng User long
     */
    getRetailer (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            return this.getretailerfromES(body, callback);
        } catch (error) {
            Logger.error('getRetailer:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        if (!body.brand_id) {
            throw Message.PRODUCT.BRAND_ID_REQUIRED;
        } else if (!body.product_id) {
            throw Message.PRODUCT.PRODUCT_ID_REQUIRED;
        } else if (!body.size) {
            throw Message.PRODUCT.SIZE_REQUIRED;
        } else if (!body.qty) {
            throw Message.PRODUCT.QTY_REQUIRED;
        } else if (!body.state) {
            throw Message.PRODUCT.STATE_REQUIRED;
        } else if (!body.postalCode) {
            throw Message.PRODUCT.POSTAL_CODE_REQUIRED;
        } else if (!body.lat) {
            throw Message.PRODUCT.LAT_IS_REQUIRED;
        } else if (!body.lng) {
            throw Message.PRODUCT.LONG_IS_REQUIRED;
        } else {
            return;
        }
    }

    /**
    * @desc This function is being used to get retailer product inventory from ES
    * @param {Object} req body data
    * @param {*} callback callback
    */
    async getretailerfromES (req, callback) {
        const retailerIds = await this.getClosestRetailer(req);
        const client = await ElasticSearch.connection();
        const { body } = await client.search({
            index: 'inventory-index',
            body: {
                _source: ['retailer_id', 'unit_price', 'stock', 'size'],
                query: {
                    bool:
                    {
                        must:
                        [
                            { match: { 'brand_id': req.brand_id } },
                            { terms: { 'retailer_id.keyword': retailerIds } },
                            { match: { 'product_id.keyword': req.product_id } },
                            { match: { 'search_size.keyword': (req.size).toLowerCase() } },
                            { range: { 'stock': { gte: req.qty } } }
                        ]
                    }
                }
            }
        });
        const retailerInventory = [];
        const totalRecords = body.hits.total.value;
        if (totalRecords > 0) {
            body.hits.hits.map(inventory => {
                retailerInventory.push({
                    retailer_id: inventory._source.retailer_id,
                    size: inventory._source.size,
                    price: inventory._source.unit_price,
                    stock: inventory._source.stock
                });
            });
            const retailers = await this.getDistanceBasedRetailers(req, retailerInventory);
            if (!retailers.length) {
                return callback(null, Utils.errorResponse(Message.PRODUCT.RETAILER_NOT_AVAILABLE));
            }
            return callback(null, Utils.successResponse(retailers));
        } else {
            return Utils.errorResponse(Message.PRODUCT.RETAILER_NOT_AVAILABLE);
        }
    }

    /**
    * @desc This function is being used to get distance based retailers
    * @param {Object} body body
    * @param {Array} retailerInventory Retailer Inventory
    */
    async getDistanceBasedRetailers (body, retailerInventory) {
        let distanceData = [];
        const projection = 'fulfillment_options,product_retail_network, market_retail_network';
        const fulfillmentPreference = await CommonService.getBrandDetail(body.brand_id, projection);
        for (const i in retailerInventory) {
            if (Object.hasOwnProperty.call(retailerInventory, i)) {
                const parmas = {
                    TableName: 'Retailers',
                    KeyConditionExpression: 'retailer_id = :retailer_id',
                    ExpressionAttributeValues: {
                        ':retailer_id': retailerInventory[i].retailer_id
                    },
                    ProjectionExpression: 'retailer_id, primary_address, retailer_name'
                };
                const retailers = await docClient.query(parmas).promise();
                if (retailers.Count > 0) {
                    const items = retailers.Items[0];
                    distanceData = this.prepareDistanceData(items, body, distanceData, retailerInventory[i], fulfillmentPreference);
                }
            }
        }
        distanceData.sort((a, b) => {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }
            return 0;
        });
        return distanceData;
    }

    /**
     * @desc This function is being used to prepare distance wise data
     * @since 09/03/2022
     * @param {Object} item Item
     * @param {Object} body Body
     * @param {Array} distanceData Distance Data
     * @param {Array} retailerInventory Retailer Inventory
     * @param {Array} fulfillmentPreference Fulfillment Preference
     */
    prepareDistanceData (items, body, distanceData, retailerInventory, fulfillmentPreference) {
        if (this.checkFulfillmentPreference(items, fulfillmentPreference)) {
            if (items.primary_address && items.primary_address.lat && items.primary_address.lng) {
                const distance = geolib.getDistance(
                    { latitude: body.lat, longitude: body.lng },
                    { latitude: items.primary_address.lat, longitude: items.primary_address.lng }
                );
                distanceData.push({
                    retailer_id: items.retailer_id,
                    retailer_name: items.retailer_name,
                    city: items.primary_address.city,
                    state: items.primary_address.state,
                    price: retailerInventory.price,
                    size: retailerInventory.size,
                    stock: retailerInventory.stock,
                    distance
                });
            }
        }
        return distanceData;
    }

    /**
     * @desc This function is being used to check fulfillment preference
     * @since 09/03/2022
     * @param {Object} item Item
     * @param {Array} fulfillmentPreference Fulfillment Preference
     */
    checkFulfillmentPreference (item, fulfillmentPreference) {
        if (fulfillmentPreference.fulfillment_options === 'market') {
            let retailerMarketType = fulfillmentPreference.market_retail_network;
            retailerMarketType = retailerMarketType.map( el => el.name );
            const state = (item.shipping_limit) ? item.shipping_limit.state : item.primary_address.state_fullname;
            if (!retailerMarketType.includes(state)) {
                return false;
            }
        }
        return true;
    }

    /**
    * @desc This function is being used to get closest retailers data
    * @param {Object} body body
    */
    async getClosestRetailer (body) {
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
        return (retailersAddresses.Count > 0) ? retailersAddresses.Items.map(obj => obj.retailer_id) : [];
    }
}
module.exports.getRetailersByProductHandler = async (event, context, callback) =>
    new GetRetailersByProduct().getRetailer(event, context, callback);
