const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const CommonService = require('./../services/common.service');

class ThirdPartyGetSalesOrder {
    /**
     * @desc This function is being used to get sales order for third party user
     * @author GrowExx
     * @since 01/11/2021
     * @param {String} sales_order_id Sales order Id in Pathparameter
     */
    async getSalesOrder (req) {
        try {
            const projection = 'order_status, order_notes, tracking_company, tracking_id, estimated_delivery_date';
            const result = await CommonService.getSalesOrder(req.pathParameters, projection);
            if (result.Count > 0) {
                const response = result.Items;
                response[0].estimated_delivery_date = CommonService.dateFormat(result.Items[0].estimated_delivery_date,
                    'MM/DD/YYYY');
                return Utils.successResponse(response);
            } else {
                return Utils.errorResponse(Message.SALES_ORDER_NOT_FOUND);
            }
        } catch (error) {
            Logger.error('thirdPartyGetCustomer:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.ThirdPartyGetSalesOrderHandler = async (event) =>
    new ThirdPartyGetSalesOrder().getSalesOrder(event);
