const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const UUID = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const EmailService = require('../../utils/email/email-service');
const TemplateHTML = require('../../utils/email/brand-user-account-creation-email');
const Bcrypt = require('./../../utils/bcrypt');

/**
 * @name CreateBrandUserWithRoles class
 * @author GrowExx
 */
class CreateBrandUserWithRoles {

    /**
     * @desc This function is being used to create brand user with roles
     * @author GrowExx
     * @since 09/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.first_name First name
     * @param {String} req.body.last_name Last name
     * @param {Array}  req.body.roles User roles
     * @param {String} req.body.created_by Created by
     */
    async createBrandUserWithRoles (req, context, callback) {
        const body = JSON.parse(req.body);
        const tempPassword = this.makeId(16);
        return this.validateRequest(body).then(async () => {
            return Bcrypt.enCryptPassword(tempPassword).then(async (hash)=> {
                body.user_id = UUID.v4();
                body.email = body.email.toLowerCase();
                body.status = 'pending';
                body.user_type = body.user_type || 'brand';
                body.is_temporary_password = true;
                body.max_market_count = Constant.DEFAULT_MARKET_COUNT;
                body.max_product_count = Constant.DEFAULT_PRODUCT_COUNT;
                body.password = hash;
                body.max_product_count = Constant.MAX_PRODUCT_COUNT;
                body.max_market_count = Constant.MAX_MARKET_COUNT;
                try {
                    var params = {
                        TableName: 'Portal_users',
                        Item: body
                    };
                    const result = await docClient.put(params).promise();
                    this.assignUserRoles(body);
                    this.createBrand(body);
                    this.createFulfillmentCenter(body);
                    this.prepareMailData(body, tempPassword);
                    return callback(null, Utils.successResponse(result));
                } catch (error) {
                    Logger.error('createAccount:catch', error);
                    return Utils.errorResponse(error);
                }
            }).catch((err) => {
                Logger.error('createBrandUserWithRoles:enCryptPassword', err);
                return Utils.errorResponse(err);
            });
        }).catch((err) => {
            Logger.error('createBrandUserWithRoles:validateRequest', err);
            return Utils.errorResponse(err);
        });
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

    /**
     * @desc This function is being used to get the user roles
     * @author GrowExx
     * @since 12/07/2021
     * @param {Object} req Request
     * @param {Array} req.body.roles User roles
     */
    async getRoles (body) {
        const params = {
            TableName: 'Roles',
            FilterExpression: '',
            ExpressionAttributeValues: {}
        };
        const roles = this.getRoleName(body);
        roles.forEach((ele, i) => {
            params.FilterExpression = `${params.FilterExpression}role_name = :role_name${i}${roles.length - 1 !== i ? ' OR ' : ''}`;
            params.ExpressionAttributeValues[`:role_name${i}`] = ele;
        });
        return docClient.scan(params).promise();
    }

    /**
     * @desc This function is being used to get the user role name
     * @author GrowExx
     * @since 12/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @return {Array} Roles array
     */
    getRoleName (body) {
        if (body.user_roles.administrator) {
            return ['Administrator'];
        } else if (body.user_roles.manager) {
            return ['Manager'];
        } else if (body.user_roles.information && body.user_roles.developer) {
            return ['Information', 'Developer'];
        } else if (body.user_roles.information) {
            return ['Information'];
        } else {
            return ['Developer'];
        }
    }

    /**
     * @desc This function is being used to assign user roles and permission
     * @author GrowExx
     * @since 09/07/2021
     * @param {Object} body Request
     * @param {Array} body.roles User roles
     */
    async assignUserRoles (body) {
        try {
            const data = await this.getRoles(body);
            if (data.Items.length) {
                const roles = [];
                data.Items.forEach((ele) => {
                    ele.role_menu.forEach((menu) => {
                        const isExist = roles.find(obj => obj.menu_id === menu.menu_id);
                        if (!isExist) {
                            roles.push(menu);
                        }
                    });
                });
                const menuParams = {
                    TableName: 'Menu',
                    FilterExpression: '',
                    ExpressionAttributeValues: {}
                };
                const len = roles.length;
                roles.forEach((ele, i) => {
                    menuParams.FilterExpression = `${menuParams.FilterExpression}menu_id = :menu_id${i}${len - 1 !== i ? ' OR ' : ''}`;
                    menuParams.ExpressionAttributeValues[`:menu_id${i}`] = ele.menu_id;
                });
                const result = await docClient.scan(menuParams).promise();
                if (result.Items.length) {
                    this.prepareMenuPermissionData(result.Items, body);
                }
            }
        } catch (error) {
            Logger.error('assignUserRoles', error);
        }
    }

    /**
     * @desc This function is being used to assign menus to user
     * @author GrowExx
     * @since 12/07/2021
     * @param {Object} body Request
     * @param {Array} body.roles User roles
     */
    async prepareMenuPermissionData (menus, body) {
        var params = {
            TableName: 'Menu_permissions',
            Item: {
                id: UUID.v4(),
                user_id: body.user_id,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime(),
                menu_items: [],
                profile_items: []
            }
        };
        for (const key in menus) {
            if (Object.hasOwnProperty.call(menus, key)) {
                const element = menus[key];
                delete element.updatedAt;
                delete element.createdAt;
                if (element.menu_category === 'brand_profile_menu') {
                    params.Item.profile_items.push(element);
                } else {
                    params.Item.menu_items.push(element);
                }
            }
        }
        await docClient.put(params).promise();
    }

    /**
     * @desc This function is being used to validate create brand user request
     * @author GrowExx
     * @since 09/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.first_name First name
     * @param {Array}  req.body.roles User roles
     * @param {String} req.body.created_by Created by
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!Constant.REGEX.EMAIL.test(body.email)) {
                reject(Message.EMAIL_NOT_VALID);
            } else if (!body.first_name) {
                reject(Message.FIRST_NAME_REQUIRED);
            } else if (!body.created_by) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.user_roles || Object.keys(body.user_roles).length === 0) {
                reject(Message.USER_ROLE_REQUIRED);
            } else {
                const user = await this.isUserAvailable(body.email.toLowerCase());
                if (user.Count > 0) {
                    reject(Message.DUPLICATE_USER);
                } else {
                    resolve(user[0]);
                }
            }
        });
    }

    /**
     * @desc This function is being used to create user brand
     * @author GrowExx
     * @since 13/07/2021
     * @param {Object} body Request
     */
    async createBrand (body) {
        const brand = await this.getBrandDetail(body.created_by);
        brand.brand_id = body.user_id;
        brand.brand_name = body.first_name;
        brand.search_brand_name = (body.first_name).toLowerCase();
        brand.createdAt = new Date().getTime();
        brand.updatedAt = new Date().getTime();
        var params = {
            TableName: 'Brands',
            Item: brand
        };
        await docClient.put(params).promise();
    }

    /**
     * @desc This function is being used to Send email
     * @author GrowExx
     * @since 13/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} tempPassword TempPassword
     */
    async prepareMailData (body, tempPassword) {
        const user = await this.isUserAvailable(body.email.toLowerCase());
        const userData = user.Items[0];
        const brand = await this.getBrandDetail(body.created_by);
        const userName = (userData.last_name) ? `${userData.first_name} ${userData.last_name}` : userData.first_name;
        const templateData = {
            'user_email': userData.email,
            'name': userName,
            'password': tempPassword,
            'role_name': this.getRoleName(body).toString(),
            'companay_name': brand.company_name
        };
        const email = {
            to: [templateData.user_email],
            from: Constant.RESET_PASSWORD.SOURCE_EMAIL
        };
        const subject = 'Temporary Password for your Portal';
        EmailService.createTemplate('BrandUserAccountCreationMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
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
            ProjectionExpression: 'company_name, company_id, brand_website, heading_images, brand_logo, heading_text'
        };
        const data = await docClient.query(params).promise();
        return data.Items[0];
    }

    /**
     * @desc This function is being used to make random password
     */
    makeId (length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    /**
     * @desc This function is being used to create fulfillment center
     * @author GrowExx
     * @since 01/02/2022
     * @param {Object} body Request
     */
    async createFulfillmentCenter (body) {
        const itemData = Constant.PARKSTREET_FULFILLMENT_CENTER;
        itemData.brand_id = body.user_id;
        var params = {
            TableName: 'Fulfillment_centers',
            Item: itemData
        };
        await docClient.put(params).promise();
    }
}
module.exports.CreateBrandUserWithRolesHandler = async (event, context, callback) =>
    new CreateBrandUserWithRoles().createBrandUserWithRoles(event, context, callback);
