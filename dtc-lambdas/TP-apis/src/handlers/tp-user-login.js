const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const CommonService = require('./../services/common.service');
const Message = require('./../../utils/message');
const Bcrypt = require('../../utils/bcrypt');
const JWT = require('../../utils/jwt');
const Constant = require('./../../utils/constants');
class ThirdPartyUserLogin {

    /**
    * @desc This function is being used to authenticate third party user login
    * @author GrowExx
    * @since 22/10/2021
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.secret_token Secret Token
    */
    async thirdPartyUserLogin (req) {
        const body = JSON.parse(req.body);
        try {
            return this.validateRequest(body).then(async () => {
                const user = await CommonService.getPublicApiToken(body.brand_id);
                if (user) {
                    return Bcrypt.comparePassword(body.secret_token, user.secret_token).then(async ()=> {
                        const token = await JWT.generate({ id: user.brand_id, user_type: Constant.USER_TYPE });
                        return Utils.successResponse({ token, brand_id: user.brand_id, active: user.active });
                    }).catch((err) => {
                        Logger.error('userSignIn:comparePassword', err);
                        return Utils.errorResponse(Message.UNAUTHORIZED, {}, 401);
                    });
                } else {
                    Logger.error('getPublicApiToken: User not found', user);
                    return Utils.errorResponse(Message.UNAUTHORIZED, {}, 401);
                }
            }).catch((err) => {
                Logger.error('thirdPartyUserLogin:comparePassword', err);
                return Utils.errorResponse(Message.UNAUTHORIZED, {}, 403);
            });
        } catch (error) {
            Logger.error('thirdPartyUserLogin:catch', error);
            return Utils.errorResponse(error);
        }
    }
    /**
     * @desc This function is being used to validate authenticate third party user login
     * @author GrowExx
     * @since 22/10/2021
     * @param {Object} body RequestBody
     * @param {String} body.brand_id Brand Id
     * @param {String} body.secret_token Secret Token
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id || !body.secret_token) {
                reject(Message.UNAUTHORIZED);
            } else {
                resolve();
            }
        });
    }
}

module.exports.ThirdPartyUserLoginHandler = async (event) =>
    new ThirdPartyUserLogin().thirdPartyUserLogin(event);
