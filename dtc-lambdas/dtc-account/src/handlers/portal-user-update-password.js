const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const PortalUserModel = require('./../../model/portal-user.model');
const Bcrypt = require('./../../utils/bcrypt');


/**
 * @name UpdatePassword class
 * @author Innovify
 */
class UpdatePassword {

    /**
     * @desc This function is being used to create user account
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.password User password
     */
    async updatePassword (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(() => {
            return Bcrypt.enCryptPassword(body.password).then(async (hash)=> {
                try {
                    await PortalUserModel.update(
                        {
                            'email': body.email
                        },
                        {
                            'is_temporary_password': false,
                            'password': hash
                        }
                    );
                    return callback(null, Utils.successResponse({ }));
                } catch (error) {
                    Logger.error('updatePassword:catch', error);
                    return Utils.errorResponse(error);
                }
            }).catch((err) => {
                Logger.error('updatePassword:enCryptPassword', err);
                return Utils.errorResponse(err);
            });
        }).catch((err) => {
            Logger.error('updatePassword:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate create account request
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.email)) {
                reject(Message.EMAIL_NOT_VALID);
            } else if (!body.password) {
                reject(Message.PASSWORD_REQUIRED);
            } else {
                const user = await PortalUserModel.query('email').eq(body.email.toLowerCase()).exec();
                if (user.count === 0) {
                    reject(Message.USER_NOT_FOUND);
                } else {
                    resolve();
                }
            }
        });
    }
}

module.exports.PortalUserUpdatePasswordHandler = async (event, context, callback) =>
    new UpdatePassword().updatePassword(event, context, callback);
