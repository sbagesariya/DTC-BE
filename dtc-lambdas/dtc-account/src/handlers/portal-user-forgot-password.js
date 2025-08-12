const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const PortalUserModel = require('./../../model/portal-user.model');
const EmailService = require('../../utils/email/email-service');
const TemplateHTML = require('../../utils/email/portal-user-forgot-password-email');
const Bcrypt = require('./../../utils/bcrypt');


/**
 * @name ForgotPassword class
 * @author Innovify
 */
class ForgotPassword {

    /**
     * @desc This function is being used to create user account
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     */
    async forgotPassword (req, context, callback) {
        const body = JSON.parse(req.body);
        const tempPassword = this.makeid(8);
        return this.validateRequest(body).then(() => {
            return Bcrypt.enCryptPassword(tempPassword).then(async (hash)=> {
                try {
                    await PortalUserModel.update(
                        {
                            'email': body.email
                        },
                        {
                            'is_temporary_password': true,
                            'password': hash
                        }
                    );
                    this.prepareMailData(body, tempPassword);
                    return callback(null, Utils.successResponse({ }));
                } catch (error) {
                    Logger.error('forgotPassword:catch', error);
                    return Utils.errorResponse(error);
                }
            }).catch((err) => {
                Logger.error('forgotPassword:enCryptPassword', err);
                return Utils.errorResponse(err);
            });
        }).catch((err) => {
            Logger.error('forgotPassword:validateRequest', err);
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

    /**
     * @desc This function is being used to Send email
     * @author Innovify
     * @since 23/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     */
    async prepareMailData (body, tempPassword) {
        var query = PortalUserModel.query('email').eq(body.email);
        const result = await query.exec();
        const userData = result[0];
        const templateData = {
            'user_email': userData.email,
            'name': `${userData.first_name} ${userData.last_name}`,
            'password': tempPassword
        };
        const email = {
            to: [templateData.user_email],
            from: Constant.RESET_PASSWORD.SOURCE_EMAIL
        };
        const subject = 'Temporary Password for your Portal';
        EmailService.createTemplate('PortalUserForgotPasswordMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    makeid (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}

module.exports.PortalUserForgotPasswordHandler = async (event, context, callback) =>
    new ForgotPassword().forgotPassword(event, context, callback);
