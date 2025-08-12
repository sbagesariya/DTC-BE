const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Message = require('./../../utils/message');
const companyInfo = require('./../../data/stripe_company_ac_info.json');
const personInfo = require('./../../data/stripe_person_ac_info.json');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

/**
 * @name CreateStripeConnectAccount class
 * @author GrowExx
 */

class CreateStripeConnectAccount {

    /**
     * @desc This function is being used to create stipe connect account
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {Object} req.body.brand Need to pass brand details in json like example file ../../data/stripe_other_ac_info.json
     */
    async createStripeConnectAccount (req, context, callback) {
        const body = JSON.parse(req.body);
        const userIP = req.requestContext.identity.sourceIp;
        try {
            this.validateRequest(body);
            const retailerUserDetails = await this.getUserDetails(body);
            const retailerDetails = await this.getRetailerDetails(body);
            const params = {
                Name: 'stripe_test_key',
                WithDecryption: true
            };
            const key = await ssm.getParameter(params).promise();
            const stripe = require('stripe')(key.Parameter.Value);
            await this.prepareAccountData(retailerUserDetails, retailerDetails, userIP);
            const stripeConnectAccount = await stripe.accounts.create(companyInfo);
            await stripe.accounts.createPerson(stripeConnectAccount.id, personInfo);
            this.updateStripeConnectAccount(retailerUserDetails.email, stripeConnectAccount.id);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('createStripeConnectAccount:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.retailer_id retailer_id
     */
    validateRequest (body) {
        if (!body.retailer_id) {
            throw Message.RETAILER_ID_REQUIRED;
        } else {
            return;
        }
    }

    /**
     * @desc This function is being used to get retailer details
     * @param {Object} body Body
     */
    async getUserDetails (body) {
        var params = {
            TableName: 'Portal_users',
            IndexName: 'user_id-index',
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': body.retailer_id
            },
            ProjectionExpression: 'email, first_name, last_name, phone'

        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        return items[0];
    }

    /**
     * @desc This function is being used to prepare account data
     * @param {Object} userDetails userDetails
     * @param {Object} retailerDetails retailerDetails
     * @param {String} userIP userIP
     */
    async prepareAccountData (userDetails, retailerDetails, userIP) {
        const lastName = userDetails.last_name || 'PS_retailer';
        personInfo.email = userDetails.email;
        personInfo.first_name = userDetails.first_name;
        personInfo.last_name = lastName;
        personInfo.phone = userDetails.phone;
        personInfo.address = {
            city: retailerDetails.primary_address.city,
            country: retailerDetails.primary_address.country,
            line1: retailerDetails.primary_address.address_line_1,
            line2: '',
            postal_code: retailerDetails.primary_address.zip_code,
            state: retailerDetails.primary_address.state
        };
        personInfo.relationship = retailerDetails.relationship;
        personInfo.ssn_last_4 = retailerDetails.ssn_last_4;
        companyInfo.email = userDetails.email;
        companyInfo.capabilities.card_payments.requested = retailerDetails.capabilities.card_payments;
        companyInfo.capabilities.transfers.requested = retailerDetails.capabilities.transfers;
        companyInfo.tos_acceptance = retailerDetails.tos_acceptance;
        companyInfo.tos_acceptance = {
            date: Math.floor(new Date().getTime() / 1000),
            ip: userIP
        };
        companyInfo.external_account = retailerDetails.external_account;
        companyInfo.company = retailerDetails.company;
        companyInfo.company.address = retailerDetails.company_address;
        companyInfo.business_profile = retailerDetails.business_profile;
    }

    /**
     * @desc This function is being used to get retailer details
     * @param {Object} body Body
     */
    async getRetailerDetails (body) {
        var params = {
            TableName: 'Retailers',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': body.retailer_id
            }

        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        return items[0];
    }

    /**
     * @desc This function is being used to update user role
     * @author GrowExx
     * @param {String} email email
     * @param {String} acId acId
     */
    updateStripeConnectAccount (email, acId) {
        var params = {
            TableName: 'Portal_users',
            Key: { email },
            UpdateExpression: 'SET stripe_connect_account = :stripe_connect_account',
            ExpressionAttributeValues: {
                ':stripe_connect_account': acId
            }
        };
        docClient.update(params, (err) => {
            if (err) {
                Logger.error('updateStripeConnectAccount:err', params.Key, err);
            }
        });
    }
}
module.exports.CreateStripeConnectAccountHandler = async (event, context, callback) =>
    new CreateStripeConnectAccount().createStripeConnectAccount(event, context, callback);
