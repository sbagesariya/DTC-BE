const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const ParameterStore = require('../../utils/ssm');
const CommonService = require('./../services/common.service');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetProductDetails class
 * @author Innovify
 */
class GetProductDetails {
    /**
   * @desc This function is being used to to get product details
   * @author Innovify
   * @since 04/03/2021
   * @param {Object} req Request
   * @param {Object} req.pathParameters PathParameters
   * @param {String} req.pathParameters.brand_id Brand Id
   * @param {String} req.pathParameters.product_id Product Id
   */
    async getProductDetails (req) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async () => {
            try {
                var params = {
                    TableName: 'Products',
                    KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id,
                        ':product_id': body.product_id
                    },
                    ProjectionExpression: `brand_id, product_id, product_name, description, ABV,
                    alcohol_type, product_images, availability_count`
                };
                const data = await docClient.query(params).promise();
                const item = data.Items;
                const brandDetail = await CommonService.getBrandDetail(body.brand_id, 'markets, brand_name');
                item[0].states = (brandDetail.markets.length) ? brandDetail.markets : [];
                const BucketURL = await ParameterStore.getValue('buket_url');
                if (item[0].hasOwnProperty('product_images') && typeof item[0].product_images !== 'undefined') {
                    const productImages = item[0].product_images;
                    Object.keys(productImages).forEach(async (key) => {
                        var val = productImages[key];
                        productImages[key] = `${BucketURL}/` + val;
                    });
                }

                return Utils.successResponse(item);
            } catch (error) {
                Logger.error('getProductDetails:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getProductDetails:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate get product details request
     * @author Innovify
     * @since 04/03/2021
     * @param {Object} req Request
     * @param {Object} req.pathParameters PathParameters
     * @param {String} req.pathParameters.brand_id Brand Id
     * @param {String} req.pathParameters.product_id Product Id
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.PRODUCT.BRAND_ID_REQUIRED);
            } else if (!body.product_id) {
                reject(Message.PRODUCT.PRODUCT_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }
}
module.exports.getCmsProductsDetailHandler = async (event, context, callback) =>
    new GetProductDetails().getProductDetails(event, context, callback);

