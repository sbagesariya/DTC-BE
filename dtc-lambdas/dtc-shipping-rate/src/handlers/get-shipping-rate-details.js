const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const CommonService = require('./../services/common.service');
const Constant = require('./../../utils/constants');
const ComplianceService = require('./../services/compliance.service');
class GetShippingRateDetails {

    /**
    * @desc This function is being used to get shipping rate details
    * @since 03/05/2021
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.retailer_id Retailer Id
    * @param {String} req.body.sub_total Sub total
    * @param {String} req.body.fulfillment_center_id Fulfillment center ID
    * @param {String} req.body.state State
    */
    async getShippingRateDetails (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            let reatilerShippingRate = 0;
            let fufillmentCenterShippingRate = 0;
            if (body.retailer_id) {
                const retailerDetails = await CommonService.getDetails('Retailers', body.retailer_id,
                    'retailer_id', 'shipping_tier, ship_rate_flat_amount, shipping_option');
                reatilerShippingRate = this.calculateShippingRateRetailer(retailerDetails, body);
            }
            if (body.fulfillment_center_id) {
                const fcDetails = await this.getFufillmentCenterDetails(body);
                fcDetails.forEach(ele => {
                    const available = ele.states.find(obj => (obj.name === body.state));
                    if (available) {
                        fufillmentCenterShippingRate = parseFloat(ele.rate.toFixed(Constant.DECIMAL_TWO));
                        return;
                    }
                });
            }
            body.shipping_charge = 0;
            const retailerProducts = body.product_detail.filter(ele => {
                return ele.retailer_id;
            });
            const fulfillCenterProducts = body.product_detail.filter(ele => {
                return ele.fulfillment_center_id;
            });
            if (retailerProducts.length) {
                body.shipping_charge += reatilerShippingRate;
            }
            if (fulfillCenterProducts.length) {
                body.shipping_charge += fufillmentCenterShippingRate;
            }
            const salesTax = await ComplianceService.calculateSalesTax(body);
            return callback(null, Utils.successResponse({ reatiler_shipping_rate: reatilerShippingRate,
                fufillment_center_shipping_rate: fufillmentCenterShippingRate, tax: salesTax }));
        } catch (error) {
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to calculate retailer shipping rate
    * @since 22/11/2021
    * @param {Object} retailerDetails Retailer shipping details
    * @param {Object} body user request object
    */
    calculateShippingRateRetailer (retailerDetails, body) {
        let shippingRate = 0;
        if (retailerDetails.shipping_option !== Constant.SHIPPING_OPTION) {
            shippingRate = retailerDetails.ship_rate_flat_amount;
        } else if (retailerDetails.shipping_tier.length) {
            retailerDetails.shipping_tier.some(ele => {
                if (body.sub_total >= ele.tier_starts && body.sub_total <= ele.tier_ends) {
                    shippingRate = ele.tier_amount.toFixed(Constant.DECIMAL_TWO);
                }
            });
        } else {
            /** */
        }
        return shippingRate;
    }

    /**
    * @desc This function is being used to validate get shipping rate detail request
    * @since 15/11/2021
    * @param {Object} body estBody
    * @param {String} body.retailer_id Retailer Id
    * @param {String} body.sub_total Sub total
    * @param {String} body.fulfillment_center_id Fulfillment center ID
    */
    validateRequest (body) {
        if (!body.retailer_id && !body.fulfillment_center_id) {
            throw Message.INVALID_REQUEST;
        } else if (body.retailer_id && !body.sub_total) {
            throw Message.INVALID_RETAILER_REQ;
        } else if (body.fulfillment_center_id && (!body.state || !body.brand_id)) {
            throw Message.INVALID_FULFILLMENT_REQ;
        } else {
            this.validateProductRequest(body);
        }
    }

    validateProductRequest (body) {
        if (!Array.isArray(body.product_detail) || !body.product_detail.length) {
            throw Message.INVALID_REQUEST_PRODUCT;
        } else if (!body.brand_name) {
            throw Message.BRAND_NAME_REQUIRED;
        } else if (!body.delivery_address || Object.keys(body.delivery_address).length === 0) {
            throw Message.INVALID_REQUEST;
        } else {
            return;
        }
    }

    /**
    * @desc This function is being used to get fulfillment center shipping ratre
    * @since 15/11/2021
    * @param {String} body.fulfillment_center_id Fulfillment center ID
    */
    async getFufillmentCenterDetails (body) {
        var params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id AND fulfillment_center_id = :fulfillment_center_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':fulfillment_center_id': body.fulfillment_center_id
            },
            ProjectionExpression: 'shipping_zone_rates'
        };
        const data = await docClient.query(params).promise();
        if (!data.Items.length) {
            throw Message.FC_NOT_FOUND;
        } else {
            const items = data.Items[0];
            return (items.shipping_zone_rates) ? items.shipping_zone_rates : [];
        }
    }
}
module.exports.getShippingRateDetailsHandler = async (event, context, callback) =>
    new GetShippingRateDetails().getShippingRateDetails(event, context, callback);
