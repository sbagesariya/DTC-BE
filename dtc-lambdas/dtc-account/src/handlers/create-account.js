const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const UserModel = require('./../../model/user.model');
const EmailService = require('../../utils/email/email-service');
const TemplateHTML = require('../../utils/email/account-creation-mail-template');
const UUID = require('uuid');
const Bcrypt = require('./../../utils/bcrypt');


/**
 * @name CreateAccount class
 * @author Innovify
 */
class CreateAccount {
    /**
     * @desc This function is being used to create user account
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.password Password
     * @param {String} req.body.confirm_password Confirm password
     * @param {String} req.body.profilePicture User email
     * @param {String} req.body.first_name Password
     * @param {String} req.body.last_name Confirm password
     * @param {String} req.body.phone User email
     * @param {Date} req.body.date_of_birth Password
     * @param {String} req.body.brand_name Brand Name
     * @param {String} req.body.brand_website Brand Website
     */
    async createAccount (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(() => {
            return Bcrypt.enCryptPassword(body.password).then(async (hash)=> {
                body.password = hash;
                body.user_id = UUID.v1();
                body.email = body.email.toLowerCase();
                body.customer_id = this.customerId(body.first_name);
                const userModel = new UserModel(body);
                try {
                    await userModel.save();
                    this.prepareMailData(body);
                    return callback(null, Utils.successResponse({ }));
                } catch (error) {
                    Logger.error('createAccount:catch', error);
                    return Utils.errorResponse(error);
                }
            }).catch((err) => {
                Logger.error('createAccount:enCryptPassword', err);
                return Utils.errorResponse(err);
            });
        }).catch((err) => {
            Logger.error('createAccount:validateRequest', err);
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
     * @param {Array} req.body.password Password
     * @param {Array} req.body.confirm_password Confirm password
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.email)) {
                reject(Message.EMAIL_NOT_VALID);
            } else if (body.password !== body.confirm_password) {
                reject(Message.PWD_NOT_MATCH);
            } else if (!body.brand_name) {
                reject(Message.BRAND_NAME_REQUIRED);
            } else if (!body.brand_website) {
                reject(Message.BRAND_WEBSITE_REQUIRED);
            } else if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                const user = await UserModel.query('email').eq(body.email.toLowerCase()).exec();
                if (user.count > 0) {
                    reject(Message.DUPLICATE_USER);
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
     * @param {String} req.body.user_email User email
     */
    prepareMailData (body) {
        const templateData = {
            'user_email': body.email,
            'name': `${body.first_name} ${body.last_name}`,
            'brand_name': body.brand_name,
            'brand_website': body.brand_website
        };
        const email = {
            to: [templateData.user_email],
            from: Constant.CREATE_ACCOUNT.SOURCE_EMAIL
        };
        const subject = `Welcome to ${templateData.brand_name}`;
        EmailService.createTemplate('CreateAccountMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    /**
     * Function to generate customer id
     * @param {String} firstName First Name
     */
    customerId (firstName) {
        const name = (firstName.substring(0, 3)).toUpperCase();
        const uniqueNumber = `${Math.random().toString(16).substr(2, 14).toUpperCase()}`;
        return ['DTC', name, uniqueNumber.slice(2, 8)].join('-');
    }
}
module.exports.CreateAccountHandler = async (event, context, callback) => new CreateAccount().createAccount(event, context, callback);
