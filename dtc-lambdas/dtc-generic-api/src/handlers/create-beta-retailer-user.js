const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constant');
const UUID = require('uuid');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Bcrypt = require('./../../utils/bcrypt');

const RetailerMenu = [
    {
        'menu_id': '83b0b4ed-48b2-440a-b7bc-7611a72fb651',
        'menu_category': 'retailer',
        'menu_name': 'Dashboard Overview',
        'menu_description': '',
        'menu_icon': 'fas fa-th-list',
        'menu_link': '/cms/dashboard-overview',
        'order_n': 1
    },
    {
        'menu_id': '6460b19b-6880-4db0-bb3d-2c15e9d582b7',
        'menu_category': 'retailer',
        'menu_name': 'Order Management',
        'menu_description': '',
        'menu_icon': 'fas fa-boxes',
        'menu_link': '/cms/orders',
        'order_n': 2
    },
    {
        'menu_id': '12ae52da-5c2a-4af2-ba14-47002ef79fcd',
        'menu_category': 'retailer',
        'menu_name': 'Product Management',
        'menu_description': '',
        'menu_icon': 'fas fa-wine-bottle',
        'menu_link': '',
        'order_n': 3
    },
    {
        'menu_id': '0fc2a4a3-7d16-4ac9-b70d-0d033faaad42',
        'menu_category': 'retailer',
        'menu_name': 'Product Inventory',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/products',
        'parent_id': '12ae52da-5c2a-4af2-ba14-47002ef79fcd',
        'order_n': 4
    },
    {
        'menu_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'menu_category': 'retailer',
        'menu_name': 'Additional Prices',
        'menu_description': '',
        'menu_icon': 'fas fa-dollar-sign',
        'menu_link': '',
        'order_n': 5
    },
    {
        'menu_id': '5ddd0a95-53d1-47b6-b226-0e3ea71e8170',
        'menu_category': 'retailer',
        'menu_name': 'Shipping Rates',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/shipping-rates',
        'parent_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'order_n': 6
    },
    {
        'menu_id': 'a4c2f041-0d28-4bf3-8a49-bfbf8e748aaa',
        'menu_category': 'retailer',
        'menu_name': 'Transaction History',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/transaction-history',
        'parent_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'order_n': 7
    }
];

const RetailerProfileMenu = [
    {
        'menu_id': '34303c87-3f58-412a-999e-6e1ff664efae',
        'order_n': 1,
        'menu_category': 'retailer_profile_menu',
        'updatedAt': 1625816160548,
        'createdAt': 1625816160548,
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/retailer/account',
        'menu_name': 'Account'
    },
    {
        'menu_id': 'dc65b254-46eb-444f-826d-a1e313591179',
        'order_n': 2,
        'menu_category': 'retailer_profile_menu',
        'updatedAt': 1625816160548,
        'createdAt': 1625816160548,
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/portal',
        'menu_name': 'Log Out'
    }
];

/**
 * @name CreateBetaRetailerUser class
 * @author GrowExx
 */
class CreateBetaRetailerUser {

    async createRetailerUser (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            const userId = await this.validateRequest(body);
            const tempPassword = Constant.USER_PASSWORD;
            const hash = await Bcrypt.enCryptPassword(tempPassword);
            var params = {
                TableName: 'Portal_users',
                Item: {
                    user_id: userId,
                    email: body.email.toLowerCase(),
                    first_name: body.first_name,
                    last_name: body.last_name,
                    phone: body.phone,
                    status: 'pending',
                    password: hash,
                    user_type: 'retailer',
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                }
            };
            const result = await docClient.put(params).promise();
            this.assignMenuPermission(userId);
            this.createRetailer(userId, body);
            this.addAddress(userId, body);
            return callback(null, Utils.successResponse(result));
        } catch (error) {
            Logger.error('createRetailerUser:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate create brand user request
     * @author GrowExx
     * @since 09/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.first_name First name
     */
    async validateRequest (body) {
        if (!body.email) {
            throw Message.EMAIL_REQUIRED;
        } else if (!Constant.REGEX.EMAIL.test(body.email)) {
            throw Message.EMAIL_NOT_VALID;
        } else if (!body.first_name) {
            throw Message.FIRST_NAME_REQUIRED;
        } else if (!body.last_name) {
            throw Message.LAST_NAME_REQUIRED;
        } else if (!body.address || Object.keys(body.address).length === 0) {
            throw Message.ADDRESS_REQUIRE;
        } else if (!body.relationship || Object.keys(body.relationship).length === 0) {
            throw Message.RELATIONSHIP_REQUIRED;
        } else if (!body.ssn_last_4) {
            throw Message.SSN_REQUIRED;
        } else if (!body.external_account || Object.keys(body.external_account).length === 0) {
            throw Message.EXTERNAL_ACCOUNT_REQUIRED;
        } else if (!body.company || Object.keys(body.company).length === 0) {
            throw Message.COMPANY_REQUIRED;
        } else if (!body.company_address || Object.keys(body.company_address).length === 0) {
            throw Message.COMPANY_ADDRESS_REQUIRED;
        } else if (!body.business_profile || Object.keys(body.business_profile).length === 0) {
            throw Message.BUSINESS_PROFILE_REQUIRED;
        } else {
            const user = await this.isUserAvailable(body.email.toLowerCase());
            let userId = UUID.v4();
            if (user.Count > 0) {
                userId = user.Items[0].user_id;
            }
            return userId;
        }
    }

    /**
     * @desc This function is being used to user is already available or not
     * @author GrowExx
     * @since 09/07/2021
     * @param {String} email User email
     */
    async isUserAvailable (email) {
        const params = {
            TableName: 'Portal_users',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': email
            }
        };
        return await docClient.query(params).promise();
    }

    async createRetailer (userId, body) {
        const obj = {};
        obj.retailer_id = userId;
        obj.retailer_name = `${body.first_name} ${body.last_name}`;
        obj.createdAt = new Date().getTime();
        obj.updatedAt = new Date().getTime();
        obj.primary_address = body.address;
        obj.relationship = body.relationship;
        obj.ssn_last_4 = body.ssn_last_4;
        obj.external_account = body.external_account;
        obj.external_account.country = body.external_account.country_code;
        delete (obj.external_account.country_code);
        obj.company = body.company;
        obj.company_address = body.company_address;
        obj.company_address.country = body.company_address.country_code;
        delete (obj.company_address.country_code);
        obj.business_profile = body.business_profile;
        obj.capabilities = {
            card_payments: true,
            transfers: true
        };
        var params = {
            TableName: 'Retailers',
            Item: obj
        };
        await docClient.put(params).promise();
    }

    async assignMenuPermission (userId) {
        const data = {
            'id': UUID.v4(),
            'user_id': userId,
            'menu_items': RetailerMenu,
            'profile_items': RetailerProfileMenu
        };
        var params = {
            TableName: 'Menu_permissions',
            Item: data
        };
        await docClient.put(params).promise();
    }

    async addAddress (userId, body) {
        var params = {
            TableName: 'Retailers_addresses',
            Item: {
                retailer_id: userId,
                createdAt: new Date().getTime(),
                is_shipping_limit: true,
                address_id: UUID.v4(),
                address: body.address,
                shipping_limit: {
                    zipcode: body.address.zip_code,
                    state: body.address.state,
                    lng: body.address.long,
                    lat: body.address.lat
                }
            }
        };
        await docClient.put(params).promise();
    }
}
module.exports.CreateBetaRetailerUserHandler = async (event, context, callback) =>
    new CreateBetaRetailerUser().createRetailerUser(event, context, callback);
