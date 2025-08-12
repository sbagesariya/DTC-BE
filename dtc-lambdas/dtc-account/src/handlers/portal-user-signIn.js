const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const Bcrypt = require('../../utils/bcrypt');
const JWT = require('../../utils/jwt');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name UserSignIn class
 * @author Innovify
 */
class UserSignIn {
    /**
     * @desc This function is being used to check user credential for signin
     * @author Innovify
     * @since 18/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.password Password
     */
    async userSignIn (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then((user) => {
            return Bcrypt.comparePassword(body.password, user.password).then(async ()=> {
                try {
                    delete user.password;
                    return Promise.all([
                        JWT.generate({
                            id: user.user_id,
                            email: user.email,
                            user_type: user.user_type
                        }),
                        this.getBrandDetail(user.user_id)
                    ])
                        .then(async (result)=> {
                            user.token = result[0];
                            user.brand = result[1];
                            if (user.user_type === 'retailer') {
                                user.retailer = await this.getReailerDetails(user.user_id);
                                user.retailer_addresses = await this.getRetailAddressDetail(user.user_id);
                            } else {
                                user.brand[0].fulfillment_preference = false;
                                if (user.brand[0].fulfillment_options === 'product') {
                                    user.brand[0].fulfillment_preference =
                                    (user.brand[0].product_fulfillment_center && user.brand[0].product_fulfillment_center.length > 0);
                                } else {
                                    user.brand[0].fulfillment_preference =
                                    (user.brand[0].product_fulfillment_center && user.brand[0].market_fulfillment_center.length > 0);
                                }
                            }
                            return Utils.successResponse(user);
                        }).catch((err)=> {
                            Logger.error('userSignIn:Promise.all', err);
                            return Utils.errorResponse(err);
                        });
                } catch (error) {
                    Logger.error('userSignIn:catch', error);
                    return Utils.errorResponse(Message.UNATHORIZED, {}, 401);
                }
            }).catch((err) => {
                Logger.error('userSignIn:comparePassword', err);
                return Utils.errorResponse(Message.UNATHORIZED, { 'email': true, 'password': false }, 401);
            });
        }).catch((err) => {
            Logger.error('userSignIn:validateRequest', err);
            return Utils.errorResponse(Message.UNATHORIZED, { 'email': false, 'password': false }, 401);
        });
    }

    /**
     * @desc This function is being used to validate user signin request
     * @author Innovify
     * @since 18/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {Array} req.body.password Password
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.email)) {
                reject(Message.EMAIL_NOT_VALID);
            } else if (!body.user_type) {
                reject(Message.USER_TYPE_REQUIRED);
            } else {
                const user = await this.getPortalUser(body.email.toLowerCase());
                if (user.count === 0) {
                    reject(Message.UNATHORIZED);
                } else if (user[0].user_type !== body.user_type) {
                    reject(Message.UNATHORIZED);
                } else {
                    resolve(user[0]);
                }
            }
        });
    }

    /**
     * Function to get Retailer user detail
     *
     * @param {String} userId
     */
    async getReailerDetails (userId) {
        const params = {
            TableName: 'Retailers',
            KeyConditionExpression: 'retailer_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': userId
            }
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }

    async getRetailAddressDetail (userId) {
        const params = {
            TableName: 'Retailers_addresses',
            KeyConditionExpression: 'retailer_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': userId
            }
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }

    /**
     * Function to get Portal user details
     *
     * @param {String} email
     */
    async getPortalUser (email) {
        const params = {
            TableName: 'Portal_users',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }

    /**
     * Function to get Brand user details
     *
     * @param {String} email
     */
    async getBrandDetail (brandId) {
        const params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            ProjectionExpression: `brand_id, brand_name, company_name, company_id, brand_website,
            fulfillment_options, product_fulfillment_center, market_fulfillment_center`
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }
}
module.exports.PortalUserSignInHandler = async (event, context, callback) => new UserSignIn().userSignIn(event, context, callback);
