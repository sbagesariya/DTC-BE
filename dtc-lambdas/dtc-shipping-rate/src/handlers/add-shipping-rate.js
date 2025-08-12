const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const UUID = require('uuid');

/**
 * @name GetAlcoholType class
 * @author Innovify
 */
class AddShippingRate {
    /**
     * @desc This function is being used to to get Alcohol Types
     * @since 04/05/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {string} req.body.retailer_id Retailer Id
     * @param {string} req.body.retailer_name Retailer name
     * @param {number} req.body.shipping_option Shipping options 1/2/3
     * @param {array} req.body.shipping_tier Shipping tier
     * @param {number} req.body.ship_rate_flat_amount Shipping rate flat amount
     */
    async addShippingRate (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                var params = {
                    TableName: 'Retailers',
                    Item: body
                };
                const result = await docClient.put(params).promise();
                Logger.info('addShippingRate:sucess');
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('addShippingRate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('addShippingRate:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate product inventory detail request
     * @since 03/05/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.retailer_id) {
                reject(Message.RETAILER_REQUIRED);
            } else if (!body.retailer_name) {
                reject(Message.RETAILER_NAME_REQUIRED);
            } else if (!body.shipping_option) {
                reject(Message.SHIPPING_OPT_REQUIRED);
            } else if (body.shipping_option === 1) {
                if (!body.ship_rate_flat_amount) {
                    reject(Message.SHIP_RATE_FLAT_AMOUNT_REQUIRED);
                } else {
                    delete body.shipping_tier;
                    resolve();
                }
            } else if (body.shipping_option === 2) {
                delete body.ship_rate_flat_amount;
                this.validateShippingTierArray(body, reject, resolve);
            } else if (body.shipping_option === 3) {
                delete body.shipping_tier;
                body.ship_rate_flat_amount = 0;
                resolve();
            } else {
                reject();
            }
        });
    }

    /**
     * @desc This function is being used to validate shipping tiers array data
     * @since 12/05/2021
     * @param {Object} body Request
     * @param {promise/callback} reject Reject promise
     * @param {promise/callback} resolve Resolve promise
     */
    validateShippingTierArray (body, reject, resolve) {
        if (Array.isArray(body.shipping_tier) && body.shipping_tier.length) {
            let isValid = true;
            body.shipping_tier.forEach(async (ele) => {
                const conditionsToCheck = [ele.tier_order, ele.tier_starts, ele.tier_ends, ele.tier_amount];
                ele.tier_id = UUID.v1();
                conditionsToCheck.forEach(val => {
                    if (typeof val !== 'number') {
                        isValid = false;
                    }
                });
            });
            if (isValid) {
                resolve();
            } else {
                reject(Message.INVALID_REQUEST);
            }
        } else {
            reject(Message.INVALID_REQUEST);
        }
    }
}
module.exports.AddShippingRateHandler = async (event, context, callback) => new AddShippingRate().addShippingRate(event, context, callback);
