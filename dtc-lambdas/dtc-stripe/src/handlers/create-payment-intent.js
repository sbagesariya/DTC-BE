// Create clients and set shared const values outside of the handler.
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const Utils = require('../../utils/lambda-response');
const OrderModel = require('./../../model/order.model');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');
const Logger = require('./../../utils/logger');
const CommonService = require('./../services/common.service');
const moment = require('moment');

class CreatePyament {

    /**
     * @desc This function is being used to place order
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.user_email User email
     * @param {Object} req.body.user_detail User detail
     * @param {Object} req.body.delivery_address Delivery address
     * @param {Object} req.body.billing_address Billing address
     * @param {Object} req.body.payment_detail Payment detail
     * @param {Array} req.body.product_detail Product detail
     * @param {String} req.body.promocode Promo code
     * @param {String} req.body.instructions instructions
     * @param {String} req.body.gift_note Gift note
     * @param {String} req.body.retailer_id Retailer Id
     */
    async placeOrder (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            await this.prepareOrderData(body);
            const orders = await this.prepareOrderProductData(body);
            await this.createPaymentIntent(orders);
            await OrderModel.batchPut(orders);
            this.isFulfillCenterProducts(orders);
            const result = orders.map(obj=> ({ created_at: obj.createdAt, order_id: obj.order_id, payment_detail: obj.payment_detail }));
            CommonService.logOrderTransaction(body.user_id, result);
            return callback(null, Utils.successResponse({ order: result, secret_id: result[0].payment_detail.stripe_payment_secret,
                brand_id: body.brand_id }));
        } catch (error) {
            Logger.error('placeOrder:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to update po_number auto increament number if there is fulfillment products
     * @param {Array} orders Orders
     */
    async isFulfillCenterProducts (orders) {
        const fulfillCenterProducts = orders.filter(ele => { return ele.fulfillment_center_id; });
        if (fulfillCenterProducts.length) {
            const poNumber = await CommonService.getDetails('Auto_increment', Constant.PARKSTREET_NAVIGATOR.PO_NUMBER_KEY,
                'increment_type');
            poNumber.increment_number += fulfillCenterProducts.length;
            CommonService.updateAutoIncrementNumber(poNumber);
        }
    }

    /**
     * @desc This function is being used to validate place order reques
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.user_email User email
     * @param {Array} req.body.product_detail Product detail
     */
    validateRequest (body) {
        if (!body.user_email) {
            throw Message.ORDER.EMAIL_REQUIRED;
        } else if (!Constant.REGEX.EMAIL.test(body.user_email)) {
            throw Message.ORDER.EMAIL_NOT_VALID;
        } else if (!Array.isArray(body.product_detail) || !body.product_detail.length) {
            throw Message.ORDER.INVALID_REQUEST_PRODUCT;
        } else if (!body.brand_name) {
            throw Message.ORDER.BRAND_NAME_REQUIRED;
        } else if (!body.brand_id) {
            throw Message.ORDER.BRAND_ID_REQUIRED;
        } else {
            return;
        }
    }

    /**
     * @desc This function is being used to create payment stripe id
     * @param {Object} body Request body object
     */
    async createPaymentIntent (orders) {
        let total = 0;
        let paymentOrderId = '';
        const paymentId = CommonService.orderNumber();
        orders.forEach((ele, i) => {
            total += Number(ele.payment_detail.total);
            paymentOrderId += i === 0 ? ele.order_id : '_' + ele.order_id;
        });
        const params = {
            Name: 'stripe_test_key',
            WithDecryption: true
        };
        const key = await ssm.getParameter(params).promise();
        const stripe = require('stripe')(key.Parameter.Value);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseInt(total * 100),
            currency: Constant.STRIPE.CURRENCY,
            description: Constant.STRIPE.DESCRIPTION,
            payment_method_types: [Constant.STRIPE.PAYMENT_METHOD_TYPE],
            transfer_group: paymentId,
            metadata: {
                order_id: paymentOrderId
            }
        });
        this.addPaymentIntentInOrders(orders, paymentIntent, paymentId);
    }

    /**
     * @desc This function is being used add payment intent Id and payment Id into all orders
     * @param {Object} body Request body object
     * @param {String} clientSecret Payment intent Id
     * @param {String} paymentId Payment Id
     */
    addPaymentIntentInOrders (orders, paymentIntent, paymentId) {
        orders.forEach((ele, i) => {
            orders[i].payment_detail.stripe_payment_intent_id = paymentIntent.id;
            orders[i].payment_id = paymentId;
            orders[i].payment_detail.stripe_payment_secret = paymentIntent.client_secret;
        });
    }

    /**
     * @desc This function is being used to prepare order data
     * @param {Object} body Request body object
     */
    async prepareOrderData (body) {
        const currentDate = moment();
        const deliveryDate = CommonService.addBusinessDays(currentDate, Constant.STANDARD_EST_DEL_DATE);
        body.search_user_name = `${(body.user_detail.first_name).toLowerCase()} ${(body.user_detail.last_name).toLowerCase()}`;
        body.search_state = (body.delivery_address.state).toLowerCase();
        body.sort_state = body.delivery_address.state;
        body.search_placed_on = currentDate.format('MM/DD/YYYY');
        body.search_brand_name = (body.brand_name).toLowerCase();
        body.sort_brand_name = (body.brand_name).toLowerCase();
        const estDeliveryDate = moment(deliveryDate).valueOf();
        body.estimated_delivery_date = estDeliveryDate;
        body.requested_delivery_date = estDeliveryDate;
        body.search_estimated_delivery_date = moment(estDeliveryDate).format('MM/DD/YYYY');
        body.created_from = Constant.USER_TYPE;
    }

    /**
     * @desc This function is being used to prepare product details data for each order
     * @param {Object} body Request body object
     */
    async prepareOrderProductData (body) {
        const orders = [];
        let poNumber;
        for (const key in body.product_detail) {
            if (Object.hasOwnProperty.call(body.product_detail, key)) {
                const ele = body.product_detail[key];
                const order = JSON.parse(JSON.stringify(body));
                order.product_detail = ele.items;
                order.order_id = CommonService.orderNumber();
                order.search_order_id = (order.order_id).toLowerCase();
                order.sort_order_id = order.order_id;
                order.createdAt = new Date().getTime() + Number(key);
                if (ele.fulfilled_by === Constant.ORDER.RETAILER) {
                    const retailerDetails = await CommonService.getDetails('Retailers', ele.retailer_id,
                        'retailer_id', 'retailer_name, shipping_tier, ship_rate_flat_amount, shipping_option');
                    order.retailer_id = ele.retailer_id;
                    order.retailer = retailerDetails.retailer_name;
                    order.search_retailer = (order.retailer).toLowerCase();
                    this.calculateRetailerShippingRateAndPyament(order, ele, retailerDetails);
                    delete order.fulfillment_center_id;
                    delete order.fulfillment_center;
                } else {
                    if (!poNumber) {
                        poNumber = await CommonService.getDetails('Auto_increment', Constant.PARKSTREET_NAVIGATOR.PO_NUMBER_KEY,
                            'increment_type');
                    }
                    const fcdetails = await CommonService.getDetails('Fulfillment_centers', body.brand_id,
                        'brand_id', 'shipping_zone_rates, fulfillment_center_name, fulfillment_center_id');
                    order.fulfillment_center_id = fcdetails.fulfillment_center_id;
                    order.fulfillment_center = fcdetails.fulfillment_center_name;
                    delete order.retailer_id;
                    await this.calculateFCPaymentDetail(order, fcdetails, body.delivery_address.full_state);
                    poNumber.increment_number += 1;
                    order.po_number = Constant.PARKSTREET_NAVIGATOR.PO_NUMBER_PREFIX + poNumber.increment_number;
                }
                orders.push(order);
            }
        }
        return orders;
    }

    /**
     * @desc This function is being used to calculate fulfillment center payment details
     * @param {Object} order Order details
     * @param {Object} fcdetails Fulfillment center details
     * @param {String} state Fulfillment center shipping charge
     */
    calculateFCPaymentDetail (order, fcdetails, state) {
        let fcShippingRate = 0;
        if (fcdetails.shipping_zone_rates && Array.isArray(fcdetails.shipping_zone_rates)) {
            fcdetails.shipping_zone_rates.forEach(ele => {
                const available = ele.states.find(obj => obj.name === state);
                if (available) {
                    fcShippingRate = ele.rate;
                    return;
                }
            });
        }
        let sum = 0;
        order.product_detail.forEach(a => sum += a.price * a.qty);
        order.payment_detail.sub_total = sum.toFixed(Constant.DECIMAL_TWO);
        order.payment_detail.shipping_charge = fcShippingRate.toFixed(Constant.DECIMAL_TWO);
        let total = ((sum + Number(fcShippingRate) + Number(order.payment_detail.tax)) - Number(order.payment_detail.discount));
        const creditCardFees = ((total * Constant.CREDIT_CARD_FEE) / 100);
        total = total + creditCardFees;
        order.payment_detail.total = total.toFixed(Constant.DECIMAL_TWO);
        order.payment_detail.credit_card_fee = creditCardFees.toFixed(Constant.DECIMAL_TWO);
        order.search_total = parseFloat(order.payment_detail.total);
        order.sort_total = parseFloat(order.payment_detail.total);
    }

    /**
     * @desc This function is being used to calculate retailer shipping charge and payment details
     * @param {Object} order Order details
     * @param {Object} products Order products
     * @param {Object} retailerDetails Retailer Order details
     */
    calculateRetailerShippingRateAndPyament (order, products, retailerDetails) {
        let sum = 0;
        let retailerShippingRate = 0;
        products.items.forEach(a => sum += a.price * a.qty);
        order.payment_detail.sub_total = sum.toFixed(Constant.DECIMAL_TWO);
        if (retailerDetails.shipping_option !== Constant.SHIPPING_OPTION) {
            retailerShippingRate = retailerDetails.ship_rate_flat_amount;
        } else if (Array.isArray(retailerDetails.shipping_tier)) {
            retailerDetails.shipping_tier.some(ele => {
                if (sum >= ele.tier_starts && sum <= ele.tier_ends) {
                    retailerShippingRate = ele.tier_amount;
                }
            });
        }
        order.payment_detail.shipping_charge = retailerShippingRate.toFixed(Constant.DECIMAL_TWO);
        let total = ((sum + Number(retailerShippingRate) + Number(order.payment_detail.tax) - Number(order.payment_detail.discount)));
        const creditCardFees = ((total * Constant.CREDIT_CARD_FEE) / 100);
        total = total + creditCardFees;
        order.payment_detail.total = total.toFixed(Constant.DECIMAL_TWO);
        order.payment_detail.credit_card_fee = creditCardFees.toFixed(Constant.DECIMAL_TWO);
        order.search_total = parseFloat(order.payment_detail.total);
        order.sort_total = parseFloat(order.payment_detail.total);
    }
}

module.exports.CreatePaymentIntentHandler = async (event, context, callback) => new CreatePyament().placeOrder(event, context, callback);
