const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/constant');
const UUID = require('uuid');
const Logger = require('./../../utils/logger');

/**
 * @name AddToCart class
 */
class AddToCart {
    /**
     * @desc This function is being used to to add product to cart
     * @since 09/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.user_id User Id
     * @param {String} req.body.cart_id Cart Id
     * @param {Array}  req.body.products Product Details
     */
    async addToCart (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            body.cart_id = (body.cart_id) ? body.cart_id : UUID.v1();
            body.createdAt = new Date().getTime();
            body.updatedAt = new Date().getTime();
            const params = {
                TableName: 'Cart',
                Item: body
            };
            docClient.put(params).promise();
            return callback(null, Utils.successResponse({ 'cart_id': body.cart_id }, 'Success!!'));
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
            throw Message.CART.BRAND_ID_REQUIRED;
        } else if (!body.user_id) {
            throw Message.CART.USER_ID_REQUIRED;
        } else if (!Array.isArray(body.product_details) || !body.product_details.length) {
            throw Message.CART.INVALID_REQUEST_PRODUCT;
        } else {
            return;
        }
    }
}
module.exports.addToCartHandler = async (event, context, callback) =>
    new AddToCart().addToCart(event, context, callback);
