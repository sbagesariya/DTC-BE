const OrderModel = require('./../../model/order.model');
const Utils = require('./../../utils/lambda-response');
const Constant = require('./../../utils/constants');
const Logger = require('./../../utils/logger');
/**
 * @name PlaceOrder class
 * @author Innovify
 */
class GetOrders {
    /**
     * @desc This function is being used to place order
     * @author Innovify
     * @since 17/12/2020
     * @param {Object} req Request
     * @param {Object} body RequestBody
     * @param {String} body.user_email User email
     * @param {String} body.order_id Order id
     * @param {String} body.limit limit
     * @param {String} body.last_key Last key from response
     */
    async getOrders (req) {
        const body = JSON.parse(req.body);
        const limit = body.limit || Constant.GET_ORDER_API_LIMIT;
        var query;
        if (body.order_id) {
            query = OrderModel.query('order_id').using('order_id-index').eq(body.order_id);
        } else if (body.user_email) {
            query = OrderModel.query('user_email').using('user_email-index').eq(body.user_email).limit(limit);
        } else {
            /** Nothing to do */
        }
        if (body.last_key) {
            query.startAt(body.last_key);
        }
        let queryResults = [];
        try {
            let result;
            do {
                result = await query.exec();
                if (result.lastKey) {
                    query.startAt(result.lastKey);
                }
                queryResults = queryResults.concat(result);
            } while (queryResults.length < limit && result.lastKey);
            return Utils.successResponse({ data: queryResults, lastKey: result.lastKey || '' });
        } catch (error) {
            Logger.error('getOrders:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.GetOrdersHandler = async (event) => new GetOrders().getOrders(event);
