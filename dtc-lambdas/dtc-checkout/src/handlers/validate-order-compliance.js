const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const ComplianceService = require('../services/compliance.service');

/**
 * @name ValidateOrderCompliance class
 * @author GrowExx
 */
class ValidateOrderCompliance {
    async validateOrderCompliance (req) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            const result = await ComplianceService.validateComplaince(body);
            let res;
            if (result.status_code !== Constant.COMPLIANCE.SUCCESS_STATUS_CODE) {
                res = Utils.errorResponse(Constant.COMPLIANCE.FAIL, result);
            } else {
                res = Utils.successResponse(result);
            }
            return res;
        } catch (error) {
            Logger.error('validateOrderCompliance:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate place order request
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
}
module.exports.ValidateOrderComplianceHandler = async (event, context, callback) =>
    new ValidateOrderCompliance().validateOrderCompliance(event, context, callback);
