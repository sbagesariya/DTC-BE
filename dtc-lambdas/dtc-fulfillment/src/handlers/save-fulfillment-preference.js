const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const superagent = require('superagent');
const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');
class SaveFulfillmentPreference {

    constructor () {
        this.nextAlphabetId = [0];
    }

    /**
     * @desc This function is being used to save fulfillment preference
     * @createdDate 16-09-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.fulfillment_options fulfillment_options
     * @param {Array} req.body.markets Order Status
     * @param {Array} req.body.product_retail_network product_retail_network
     * @param {Array} req.body.product_fulfillment_center product_fulfillment_center
     * @param {Array} req.body.market_retail_network market_retail_network
     * @param {Array} req.body.market_fulfillment_center market_fulfillment_center
     */
    saveFulfillmentPreference (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (brand) => {
            brand.updatedAt = new Date().getTime();
            brand.markets = body.markets;
            brand.product_retail_network = [];
            brand.product_fulfillment_center = [];
            brand.market_retail_network = [];
            brand.market_fulfillment_center = [];
            brand.fulfillment_options = body.fulfillment_options;
            brand[body.fulfillment_options + '_retail_network'] = body.retail_network;
            brand[body.fulfillment_options + '_fulfillment_center'] = body.fulfillment_center;
            try {
                await this.updateFulfillmentSettings(body);
                await this.getFulfillmentInventory(body);
                var params = {
                    TableName: 'Brands',
                    Item: brand
                };
                const result = await docClient.put(params).promise();
                this.updateBrandFulfilmentInvetoryProducts({ 'brands': [{ id: body.brand_id }] });
                return callback(null, Utils.successResponse(result));
            } catch (error) {
                Logger.error('saveFulfillmentPreference:catch', error);
                return callback(null, Utils.errorResponse(error));
            }
        }).catch((err) => {
            Logger.error('saveFulfillmentPreference:validateRequest', err);
            return callback(null, Utils.errorResponse('Failed', err));
        });
    }

    /**
     * @desc This function is being used to update fullfillment inventory products of brand
     * @param {Object} body Request body of brand Ids
     */
    updateBrandFulfilmentInvetoryProducts (body) {
        superagent
            .post(process.env.FULFILLMENT_PREFERENCE_API_URL + Constant.FULFILLMENT_INVENTORY_API_ENDPOINT)
            .set('X-Api-Key', process.env.FULFILLMENT_API_KEY)
            .send(body)
            .end((err) => {
                if (err) {
                    Logger.error('updateBrandFulfilmentInvetoryProducts:err', err);
                }
            });
    }

    /**
     * @desc This function is being used to validate save fulfillment preference
     * @createdDate 16-09-2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.fulfillment_options fulfillment_options
     * @param {Array} req.body.markets Order Status
     * @param {Array} req.body.product_retail_network product_retail_network
     * @param {Array} req.body.product_fulfillment_center product_fulfillment_center
     * @param {Array} req.body.market_retail_network market_retail_network
     * @param {Array} req.body.market_fulfillment_center market_fulfillment_center
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!Array.isArray(body.markets) || (body.fulfillment_options !== Constant.FULFILLMENT_OPTIONS.MARKET &&
                    body.fulfillment_options !== Constant.FULFILLMENT_OPTIONS.PRODUCT)) {
                reject(Message.INVALID_REQUEST);
            } else if (!Array.isArray(body.retail_network) || !Array.isArray(body.fulfillment_center)) {
                reject(Message.INVALID_REQUEST);
            } else {
                const params = {
                    TableName: 'Brands',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    }
                };
                const brandData = await docClient.query(params).promise();
                if (brandData.Count === 0) {
                    reject(Message.INVALID_BRAND);
                } else {
                    const items = brandData.Items[0];
                    resolve(items);
                }
            }
        });
    }

    /**
     * @desc This function is being used to get and update selected fulfillment settings
     * @since 25/10/2021
     * @param {Object} body Body
     */
    async updateFulfillmentSettings (body) {
        const params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            }
        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        const finalStateData = [];
        this.nextAlphabetId = [0];
        if (items.length) {
            const item = items[0];
            if (item.shipping_zone_rates && item.shipping_zone_rates.length) {
                const selectedMarkets = (body.fulfillment_options === Constant.MARKET) ? body.fulfillment_center : body.markets;
                item.shipping_zone_rates.forEach(element => {
                    element.states = element.states.filter(zstate => selectedMarkets.some(fstate => fstate.id === zstate.id));
                    if (element.states.length > 0) {
                        element.name = 'Zone ' + this.nextAlphabet();
                        finalStateData.push(element);
                    }
                });
            }
            item.shipping_zone_rates = finalStateData;
            var fulfillmentParams = {
                TableName: 'Fulfillment_centers',
                Item: item
            };
            await docClient.put(fulfillmentParams).promise();
        }
    }

    /**
     * @desc This function is being used to get fulfillment inventory product settings
     * @since 25/10/2021
     * @param {Object} body Body
     */
    async getFulfillmentInventory (body) {
        const params = {
            TableName: 'Fulfillment_inventory',
            KeyConditionExpression: 'brand_id = :brand_id',
            IndexName: 'brand_id-index',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            }
        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        if (items.length) {
            for (const key in items) {
                if (Object.hasOwnProperty.call(items, key)) {
                    const itemsData = items[key];
                    await this.updateFulfillmentInventory(body, itemsData);
                }
            }
        }
    }

    incrementAlphabet (previous) {
        for (let i = 0; i < this.nextAlphabetId.length; i++) {
            if (previous) {
                --this.nextAlphabetId[i];
            } else {
                ++this.nextAlphabetId[i];
            }
            const val = this.nextAlphabetId[i];
            if (val >= Constant.ALPHABETS.length) {
                this.nextAlphabetId[i] = 0;
            } else {
                return;
            }
        }
        this.nextAlphabetId.push(0);
    }

    nextAlphabet (previous = false) {
        const r = [];
        for (const char of this.nextAlphabetId) {
            r.unshift(Constant.ALPHABETS[char]);
        }
        this.incrementAlphabet(previous);
        return r.join('');
    }

    /**
     * @desc This function is being used to update fulfillment settings
     * @since 25/10/2021
     * @param {Object} body Body
     * @param {Object} itemsData Items Data
     */
    async updateFulfillmentInventory (body, itemsData) {
        const finalStateData = [];
        if (itemsData.unit_price_per_market) {
            const selectedMarkets = (body.fulfillment_options === Constant.MARKET) ? body.fulfillment_center : body.markets;
            itemsData.unit_price_per_market.forEach(element => {
                element.states = element.states.filter(zstate =>
                    selectedMarkets.some(fstate => fstate.id === zstate.id));
                if (element.states.length > 0) {
                    finalStateData.push(element);
                }
            });
            itemsData.unit_price_per_market = finalStateData;
        }
        var params = {
            TableName: 'Fulfillment_inventory',
            Item: itemsData
        };
        await docClient.put(params).promise();
    }
}
module.exports.SaveFulfillmentPreferenceHandler = async (event, context, callback) =>
    new SaveFulfillmentPreference().saveFulfillmentPreference(event, context, callback);
