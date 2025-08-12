const Utils = require('../../utils/lambda-response');
const UUID = require('uuid');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Bcrypt = require('./../../utils/bcrypt');
const Constant = require('../../utils/constant');

/**
 * @name CreateBetaBrandUser class
 * @author GrowExx
 */
class CreateBetaBrandUser {

    /**
     * @desc This function is being used to create new brand and company
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {Object} req.body.brand Need to pass brand details in json like example file ../../data/brand.json
     * @param {Object} req.body.company Need to pass company details in json like example file ../../data/company.json
     */
    createBrandUser (req, context, callback) {
        const body = JSON.parse(req.body);
        const brand = body.brand;
        const tempPassword = brand.password;
        const website = body.brand.brand_website || '';
        delete (body.brand.brand_website);
        return Bcrypt.enCryptPassword(tempPassword).then(async (hash)=> {
            brand.password = hash;
            try {
                var params = {
                    TableName: 'Portal_users',
                    Item: brand
                };
                const result = await docClient.put(params).promise();
                this.assignUserRoles(brand);
                this.createCompany(body.company);
                this.createBrand(brand, body.company, website);
                this.createFulfillmentCenter(brand);
                return callback(null, Utils.successResponse(result));
            } catch (error) {
                Logger.error('createAccount:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('createBrandUserWithRoles:enCryptPassword', err);
            return Utils.errorResponse(err);
        });
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
     * @desc This function is being used to create parkstreet company
     * @author GrowExx
     * @param {Object} company Request
     */
    async createCompany (company) {
        var params = {
            TableName: 'Company',
            Item: company
        };
        await docClient.put(params).promise();
    }

    /**
     * @desc This function is being used to create user brand
     * @author GrowExx
     * @since 13/07/2021
     * @param {Object} body Request
     */
    async createBrand (body, company, website) {
        const data = {};
        data.brand_id = body.user_id;
        data.brand_name = body.first_name;
        data.search_brand_name = (body.first_name).toLowerCase();
        data.heading_text = 'Award Winning';
        data.brand_website = website;
        data.company_id = company.company_id;
        data.company_name = company.company_name;
        data.createdAt = new Date().getTime();
        data.updatedAt = new Date().getTime();
        var params = {
            TableName: 'Brands',
            Item: data
        };
        await docClient.put(params).promise();
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
module.exports.CreateBetaBrandUserHandler = async (event, context, callback) =>
    new CreateBetaBrandUser().createBrandUser(event, context, callback);
