const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/message');
const CommonService = require('./../services/common.service');
class ThirdPartyGetCustomer {

    async getCustomer (event) {
        const body = event.pathParameters;
        try {
            this.validateRequest(body);
            const projection = 'customer_id, user_id, first_name, last_name, phone, date_of_birth, email';
            const result = await CommonService.checkCustomer(body, projection);
            if (result.Count > 0) {
                const response = result.Items;
                response[0].date_of_birth = CommonService.dateFormat(result.Items[0].date_of_birth, 'MM/DD/YYYY');
                return Utils.successResponse(response);
            }
            return Utils.errorResponse(Message.CUSTOMER_NOT_FOUND);
        } catch (error) {
            Logger.error('thirdPartyGetCustomer:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate authenticate third party user login
     * @author GrowExx
     * @since 22/10/2021
     * @param {Object} body RequestBody
     * @param {String} body.customer_id Customer Id
     */
    validateRequest (body) {
        if (!body.customer_id) {
            throw Message.CUSTOMERID_REQUIRED;
        } else {
            return '';
        }
    }
}
module.exports.ThirdPartyGetCustomerHandler = async (event) =>
    new ThirdPartyGetCustomer().getCustomer(event);
