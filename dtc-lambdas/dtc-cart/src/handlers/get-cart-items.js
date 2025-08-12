const Utils = require('../../utils/lambda-response');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Constant = require('./../../utils/constant');
const Logger = require('./../../utils/logger');
const CommonService = require('./../services/common.service');
const ComplianceService = require('./../services/compliance.service');
const geolib = require('geolib');

/**
 * @name GetCartItems class
 */
class GetCartItems {

    /**
     * @desc This function is being used to get shipping rate details
     * @since 15/03/2022
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.user_id User Id
     * @param {String} req.body.brand_name Brand Name
     * @param {String} req.body.state State
     * @param {Array}  req.body.delivery_address Delivery Address
     */
    async getCartItems (req) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            var params = {
                TableName: 'Cart',
                KeyConditionExpression: 'user_id = :user_id',
                ExpressionAttributeValues: {
                    ':user_id': body.user_id
                },
                ProjectionExpression: 'user_id, brand_id, cart_id, product_details'
            };
            const data = await docClient.query(params).promise();
            const item = data.Items;
            const result = {};
            if (item.length) {
                const cartItems = item[0];
                result.cart = await this.prepareCartItems(cartItems, body);
                result.rate = await this.calculateShippingRate(body, result.cart);
            }
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getCartItems:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to validate get shipping rate detail request
    * @since 21/03/2022
    * @param {Object} body body
    */
    validateRequest (body) {
        if (!body.brand_id) {
            throw Constant.CART.BRAND_ID_REQUIRED;
        } else if (!body.user_id) {
            throw Constant.CART.USER_ID_REQUIRED;
        } else if (!body.brand_name) {
            throw Constant.CART.BRAND_NAME_REQUIRED;
        } else if (!body.delivery_address || Object.keys(body.delivery_address).length === 0) {
            throw Constant.CART.INVALID_REQUEST;
        } else if (!body.state) {
            throw Constant.CART.STATE_NAME_REQUIRED;
        } else {
            return;
        }
    }

    /**
     * @desc This function is used to prepare cart Items
     * @since 15/03/2022
     * @param {Array} items items
     * @param {Object} body body
     */
    async prepareCartItems (items, body) {
        const result = {};
        result.user_id = items.user_id;
        result.brand_id = items.brand_id;
        result.cart_id = items.cart_id;
        const cartItems = [];
        for (const key in items.product_details) {
            if (Object.hasOwnProperty.call(items.product_details, key)) {
                const element = items.product_details[key];
                element.stock = await this.getProductStock(items.product_details[key]);
                if (element.retailer_id) {
                    await this.prepareRetailerCartItems(element, cartItems, body);
                }
                if (element.fulfillment_center_id) {
                    await this.prepareFufillmentCenterCartItems(element, cartItems, result.brand_id, body);
                }
            }
        }
        cartItems.sort((a, b) => {
            if (a.distance < b.distance) {
                return -1;
            }
            if (a.distance > b.distance) {
                return 1;
            }
            return 0;
        });
        result.products = cartItems;
        return result;
    }

    /**
     * @desc This function is used to calculate shipping rate
     * @since 21/03/2022
     * @param {Object} body body
     * @param {Array} cartItems Cart Items
     */
    async calculateShippingRate (body, cartItems) {
        let shippingCharge = 0;
        let tax = 0;
        for (const key in cartItems.products) {
            if (Object.hasOwnProperty.call(cartItems.products, key)) {
                const ele = cartItems.products[key];
                body.product_detail = ele.items;
                body.shipping_charge = 0;
                if (ele.retailer_id) {
                    const retailerDetails = await CommonService.getDetails('Retailers', ele.retailer_id,
                        'retailer_id', 'shipping_tier, ship_rate_flat_amount, shipping_option');
                    body.shipping_charge = this.calculateRetailerShippingRate(retailerDetails, ele.sub_total);
                }
                if (ele.fulfillment_center_id) {
                    const fcDetails = await CommonService.getFufillmentCenterDetails(cartItems.brand_id, ele.fulfillment_center_id);
                    body.shipping_charge = this.calculateFCShippingRate(fcDetails, body.state);
                }
                ele.shipping_charge = Number(body.shipping_charge.toFixed(Constant.DECIMAL_TWO));
                shippingCharge += body.shipping_charge;
                const itemTax = await ComplianceService.calculateSalesTax(body);
                ele.tax = Number(itemTax.toFixed(Constant.DECIMAL_TWO));
                tax += itemTax;
            }
        }
        return { shipping_rate: Number(shippingCharge.toFixed(Constant.DECIMAL_TWO)), tax: Number(tax.toFixed(Constant.DECIMAL_TWO)) };
    }

    /**
     * @desc This function is being used to calculate retailer shipping rate
     * @since 22/11/2021
     * @param {Object} retailerDetails Retailer shipping details
     * @param {String} subTotal subTotal
     */
    calculateRetailerShippingRate (retailerDetails, subTotal) {
        let shippingRate = 0;
        if (retailerDetails.shipping_option === Constant.SHIPPING_OPTION) {
            retailerDetails.shipping_tier.some(ele => {
                if (subTotal >= ele.tier_starts && subTotal <= ele.tier_ends) {
                    shippingRate = ele.tier_amount;
                }
            });
        } else {
            shippingRate = retailerDetails.ship_rate_flat_amount || 0;
        }
        return shippingRate;
    }

    /**
     * @desc This function is being used to calculate fufillment center shipping rate
     * @since 22/11/2021
     * @param {Object} fcDetails fufillment center Details
     * @param {String} state state
     */
    calculateFCShippingRate (fcDetails, state) {
        let shippingRate = 0;
        if (fcDetails.shipping_zone_rates) {
            fcDetails.shipping_zone_rates.forEach(e => {
                const available = e.states.find(obj => (obj.name === state));
                if (available) {
                    shippingRate = parseFloat(e.rate);
                    return;
                }
            });
        }
        return shippingRate;
    }

    /**
     * @desc This function is used to prepare retailer cart Items
     * @since 15/03/2022
     * @param {Array} element element
     * @param {Array} cartItems cartItems
     * @param {Object} body body
     */
    async prepareRetailerCartItems (element, cartItems, body) {
        const productItems = [];
        const res = {};
        const foundIndex = cartItems.findIndex(obj => (obj.retailer_id === element.retailer_id));
        if (foundIndex !== -1) {
            cartItems[foundIndex].sub_total += (element.price * element.qty);
            cartItems[foundIndex].items.push(element);
        } else {
            const retailerDetails = await CommonService.getDetails('Retailers', element.retailer_id,
                'retailer_id', 'retailer_name, primary_address');
            res.fulfilled_by = Constant.CART.RETAILER;
            res.retailer_id = element.retailer_id;
            res.name = retailerDetails.retailer_name;
            res.city = (retailerDetails.primary_address) ? retailerDetails.primary_address.city : '';
            res.sub_total = (element.price * element.qty);
            res.distance = this.calculateDistance(retailerDetails, body);
            productItems.push(element);
            res.items = productItems;
            cartItems.push(res);
        }
        delete (element.retailer_id);
    }

    /**
     * @desc This function is used to prepare fufillment center cart Items
     * @since 15/03/2022
     * @param {Array} element element
     * @param {Array} cartItems cartItems
     * @param {String} brandId Brand Id
     * @param {Object} body body
     */
    async prepareFufillmentCenterCartItems (element, cartItems, brandId, body) {
        const productItems = [];
        const res = {};
        const foundIndex = cartItems.findIndex(obj => (obj.fulfillment_center_id === element.fulfillment_center_id));
        if (foundIndex !== -1) {
            cartItems[foundIndex].sub_total += (element.price * element.qty);
            cartItems[foundIndex].items.push(element);
        } else {
            const fcDetails = await CommonService.getFufillmentCenterDetails(brandId, element.fulfillment_center_id);
            res.fulfilled_by = Constant.CART.FULFILLMENT;
            res.fulfillment_center_id = element.fulfillment_center_id;
            res.name = fcDetails.fulfillment_center_name;
            res.city = (fcDetails.primary_address) ? fcDetails.primary_address.city : '';
            res.sub_total = (element.price * element.qty);
            res.distance = this.calculateDistance(fcDetails, body);
            productItems.push(element);
            res.items = productItems;
            cartItems.push(res);
        }
        delete (element.fulfillment_center_id);
    }

    /**
    * @desc This function is being used to get product stock
    * @param {Object} productDetail productDetail
    */
    async getProductStock (productDetail) {
        const params = {};
        if (productDetail.retailer_id) {
            params.TableName = 'Inventory';
            params.KeyConditionExpression = 'retailer_id = :retailer_id';
            params.ExpressionAttributeValues = {
                ':retailer_id': productDetail.retailer_id
            };
        } else {
            params.TableName = 'Fulfillment_inventory';
            params.KeyConditionExpression = 'fulfillment_center_id = :fulfillment_center_id';
            params.ExpressionAttributeValues = {
                ':fulfillment_center_id': productDetail.fulfillment_center_id
            };
        }
        params.FilterExpression = 'product_id = :product_id AND size = :size';
        params.ExpressionAttributeValues[':product_id'] = productDetail.product_id;
        params.ExpressionAttributeValues[':size'] = productDetail.size;
        params.ProjectionExpression = 'stock';
        const stockDetails = await docClient.query(params).promise();
        return (stockDetails.Items.length) ? stockDetails.Items[0].stock : 0;
    }

    /**
     * @desc This function is being used to calculate distance
     * @since 07/04/2022
     * @param {Object} item Item
     * @param {Object} body Body
     */
    calculateDistance (items, body) {
        let distance = 0 ;
        if (items.primary_address && items.primary_address.lat && items.primary_address.lng) {
            distance = geolib.getDistance(
                { latitude: body.delivery_address.lat, longitude: body.delivery_address.lng },
                { latitude: items.primary_address.lat, longitude: items.primary_address.lng }
            );
        }
        return distance;
    }
}
module.exports.getCartItemsHandler = async (event, context, callback) =>
    new GetCartItems().getCartItems(event, context, callback);
