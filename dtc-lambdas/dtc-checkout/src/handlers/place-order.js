const OrderModel = require('./../../model/order.model');
const Utils = require('./../../utils/lambda-response');
const UUID = require('uuid');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');
const Logger = require('./../../utils/logger');
/**
 * @name PlaceOrder class
 * @author Innovify
 */
class PlaceOrder {
    /**
     * @desc This function is being used to place order
     * @author Innovify
     * @since 17/12/2020
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
     */
    placeOrder (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            body.order_id = this.orderNumber();
            const placeOrder = new OrderModel(body);
            try {
                await placeOrder.save();
                return Utils.successResponse({ order_id: body.order_id });
            } catch (error) {
                Logger.error('placeOrder:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('placeOrder:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate place order request
     * @author Innovify
     * @since 17/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.user_email User email
     * @param {Array} req.body.product_detail Product detail
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.user_email) {
                reject(Message.ORDER.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.user_email)) {
                reject(Message.ORDER.EMAIL_NOT_VALID);
            } else if (!Array.isArray(body.product_detail) || !body.product_detail.length) {
                reject(Message.ORDER.INVALID_REQUEST_PRODUCT);
            } else {
                resolve();
            }
        });
    }

    orderNumber () {
        const now = Date.now().toString();
        const second = Math.random().toString(16).substr(2, 14).toUpperCase();
        const first = `${now}${Math.floor(Math.random() * 10)}`;
        return [first.slice(7, 13), second.slice(2, 7)].join('-');
    }
}
module.exports.PlaceOrderHandler = async (event) => new PlaceOrder().placeOrder(event);
