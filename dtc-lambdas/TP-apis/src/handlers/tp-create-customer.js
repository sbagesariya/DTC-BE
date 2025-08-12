const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const UUID = require('uuid');
const moment = require('moment');
const CommonService = require('./../services/common.service');

class ThirdPartyCreateCustomer {
    /**
     * @desc This function is being used to create customer for third party user
     * @author GrowExx
     * @since 30/10/2021
     * @param {Object} body RequestBody
     * @param {String} body.email Email
     * @param {String} body.first_name First name
     * @param {String} body.last_name Last name
     * @param {String} body.phone Phone number
     * @param {String} body.date_of_birth Birth date
     */
    async createCustomer (req) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            await this.checkCustomerByEmail(body);
            body.user_id = UUID.v4();
            body.customer_id = CommonService.customerId(body.first_name);
            body.email = body.email.toLowerCase();
            body.status = Constant.COSTUMER_STATUS;
            body.created_from = Constant.USER_TYPE;
            body.createdAt = new Date().getTime();
            body.updatedAt = new Date().getTime();
            body.date_of_birth = new Date(body.date_of_birth).getTime();
            const params = {
                TableName: 'Users',
                Item: body
            };
            await docClient.put(params).promise();
            return Utils.successResponse({ customer_id: body.customer_id });
        } catch (error) {
            Logger.error('thirdPartyGetCustomer:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async checkCustomerByEmail (body) {
        var params = {
            TableName: 'Users',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': body.email
            },
            ProjectionExpression: 'email, user_id'
        };
        const user = await docClient.query(params).promise();
        const item = user.Items;
        if (item.length) {
            throw Message.CUSTOMER_IS_EXIST;
        }
    }

    /**
     * @desc This function is being used to validate create customer request for third party user
     * @author GrowExx
     * @since 30/10/2021
     * @param {Object} body RequestBody
     * @param {String} body.email Email
     * @param {String} body.first_name First name
     * @param {String} body.last_name Last name
     * @param {String} body.phone Phone number
     * @param {String} body.date_of_birth Birth date
     */
    validateRequest (body) {
        const date = moment(body.date_of_birth, 'YYYY/MM/DD', true);
        const conditionsToCheck = [
            body.email, body.first_name, body.last_name, body.phone, body.date_of_birth
        ];
        if (!conditionsToCheck.every(condition => condition)) {
            throw Message.INVALID_REQUEST;
        } else if (!Constant.REGEX.EMAIL.test(body.email)) {
            throw Message.EMAIL_NOT_VALID;
        } else if (!date.isValid()) {
            throw Message.INVALID_REQUEST;
        } else {
            return '';
        }
    }
}
module.exports.ThirdPartyCreateCustomerHandler = async (event) =>
    new ThirdPartyCreateCustomer().createCustomer(event);
