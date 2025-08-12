const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const BrandModel = require('./../../model/brand.model');
class CompanyBrands {
    /**
   * @desc This function is being used to get brands by the company
   * @author Innovify
   * @since 28/01/2021
   * @param {Object} req Request
   * @param {String} req.pathParameters.company_id Company Id
   */
    async companyBrands (req) {
        if (!req.pathParameters.company_id) {
            return Utils.errorResponse(undefined, Message.BRAND_ID_REQUIRED);
        }
        try {
            const brands =
        await BrandModel.scan('company_id').eq(req.pathParameters.company_id)
            .attributes(['brand_id', 'brand_name', 'brand_logo', 'heading_text', 'brand_website']).exec();
            if (brands.count) {
                return Utils.successResponse(brands);
            } else {
                return Utils.errorResponse(Message.NO_DATA_FOUND);
            }
        } catch (error) {
            return Utils.errorResponse('', error);
        }
    }
}
module.exports.getBrandByCompanyHandler = async (event) => new CompanyBrands().companyBrands(event);
