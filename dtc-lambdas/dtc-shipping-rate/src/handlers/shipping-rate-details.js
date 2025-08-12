const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const CommonService = require('../services/common.service');
class ShippingRateDetails {

    /**
    * @desc This function is being used to get shipping rate details
    * @since 17/11/2021
    * @param {Object} req Request
    * @param {String} req.path.retailer_id Retailer Id
    */
    async shippingRateDetails (req) {
        if (!req.pathParameters.retailer_id) {
            return Utils.errorResponse(undefined, Message.RETAILER_REQUIRED);
        }
        try {
            const retailerDetails = await CommonService.getDetails('Retailers', req.pathParameters.retailer_id, 'retailer_id');
            return Utils.successResponse([retailerDetails]);
        } catch (error) {
            return Utils.errorResponse(error);
        }
    }
}
module.exports.ShippingRateDetailsHandler = async (event) => new ShippingRateDetails().shippingRateDetails(event);

