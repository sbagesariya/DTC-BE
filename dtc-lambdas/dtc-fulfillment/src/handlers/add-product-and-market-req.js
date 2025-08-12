const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Constant = require('../../utils/constants');
const EmailService = require('./../../utils/email/email-service');
const ConfirmationTemplateHTML = require('../../utils/email/add-product-and-market-confirm-template');
const ReqTemplateHTML = require('../../utils/email/add-product-and-market-req-template');
const Message = require('./../../utils/message');
class AddProductAndMarket {

    /**
     * @desc This function is being used to add more product/market request
     * @since 06/09/2021
     * @param {Object} body RequestBody
     * @param {String} body.user_email User email
     * @param {String} body.user_name User name
     * @param {String} body.brand_name Brand name
     * @param {String} body.req_type Request type
     * @param {String} body.brand_id Brand Id
     */
    addProductAndMarket (req, content, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const email = {
                    to: [body.user_email],
                    from: Constant.MARKET_PRODUCT_REQ.SOURCE_EMAIL
                };
                const parkstreetEamil = {
                    to: [Constant.MARKET_PRODUCT_REQ.PARKSTREET_TEAM],
                    from: Constant.MARKET_PRODUCT_REQ.SOURCE_EMAIL
                };
                const subject = 'DTC Upgrade Request';
                return this.getLimits(body).then(async (data) => {
                    body.total_markets = data.max_market_count || 0;
                    body.total_products = data.max_product_count || 0;
                    EmailService.createTemplate('AddProductAndMarketConfirmTemplate', subject, email,
                        ConfirmationTemplateHTML, JSON.stringify(body));
                    if (body.req_type === 'products') {
                        EmailService.createTemplate('AddProductAndMarketReqTemplate', `${subject} ${body.brand_name}`, parkstreetEamil,
                            ReqTemplateHTML, JSON.stringify(body));
                    }
                    return callback(null, Utils.successResponse());
                }).catch(err=> {
                    Logger.error('addProductAndMarket:getLimits', err);
                    return Utils.errorResponse(err);
                });
            } catch (error) {
                Logger.error('addProductAndMarket:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch(err=> {
            Logger.error('addProductAndMarket:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to get products and markets limit
     * @since 06/09/2021
     * @param {Object} body RequestBody
     * @param {String} body.brand_id Brand Id
     */
    getLimits (body) {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: 'Portal_users',
                IndexName: 'user_id-index',
                KeyConditionExpression: '#brand = :brand_id',
                ExpressionAttributeNames: {
                    '#brand': 'user_id'
                },
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id
                },
                ProjectionExpression: 'max_product_count, max_market_count'

            };
            docClient.query(params, (err, data) => {
                if (err) {
                    reject(err);
                } else if (!data.Items.length) {
                    resolve(Message.INVALID_BRAND);
                } else {
                    resolve(data.Items[0]);
                }
            });
        });
    }

    /**
     * @desc This function is being used to validate add more product/market request
     * @since 07/09/2021
     * @param {Object} body RequestBody
     * @param {String} body.user_email User email
     * @param {String} body.user_name User name
     * @param {String} body.brand_name Brand name
     * @param {String} body.req_type Request type
     * @param {String} body.brand_id Brand Id
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.user_email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.user_email)) {
                reject(Message.EMAIL_NOT_VALID);
            } else if (!body.user_name) {
                reject(Message.USERNAME_REQUIRED);
            } else if (!body.req_type) {
                reject(Message.REQ_TYPE_REQUIRED);
            } else if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.brand_name) {
                reject(Message.BRAND_NAME_REQUIRED);
            } else {
                resolve();
            }
        });
    }

}
module.exports.AddProductAndMarketReqHandler = async (event, context, callback) =>
    new AddProductAndMarket().addProductAndMarket(event, context, callback);
