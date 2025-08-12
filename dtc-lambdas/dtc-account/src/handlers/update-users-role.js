const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Message = require('./../../utils/message');
const UUID = require('uuid');

/**
 * @name CreateBrandUserWithRoles class
 * @author GrowExx
 */
class UpdateUsersRoleHandler {
    /**
     * @desc This function is being used to update users roles
     * @author GrowExx
     * @since 14/07/2021
     */
    async updateUsersRoleHandler (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async ()=> {
            try {
                this.updateUserRoles(body);
                this.assignUserRoles(body);
                return callback(null, Utils.successResponse());
            } catch (error) {
                Logger.error('updateUsersRoleHandler:catch', error);
                return Utils.errorResponse(null, error);
            }
        }).catch((err) => {
            Logger.error('updateUsersRoleHandler:validateRequest', err);
            return Utils.errorResponse(err);
        });

    }

    /**
     * @desc This function is being used to update user role
     * @author GrowExx
     * @since 14/07/2021
     * @param {Object} body RequestBody
     * @param {String} body.email User email
     * @param {String} body.first_name First name
     * @param {Object} body.user_roles Last name
     * @return {callback}
     */
    updateUserRoles (body) {
        body.forEach((ele) => {
            var params = {
                TableName: 'Portal_users',
                Key: {
                    email: ele.email
                },
                UpdateExpression: 'SET #user_roles = :user_roles',
                ExpressionAttributeNames: {
                    '#user_roles': 'user_roles'
                },
                ExpressionAttributeValues: {
                    ':user_roles': ele.user_roles
                }
            };
            docClient.update(params, (err) => {
                if (err) {
                    Logger.error('updateUserRoles:err', params.Key, err);
                }
            });
        });
    }

    /**
     * @desc This function is being used to get the user roles
     * @author GrowExx
     * @since 16/07/2021
     */
    async getRoles () {
        const params = {
            TableName: 'Roles'
        };
        return docClient.scan(params).promise();
    }

    /**
     * @desc This function is being used to get the user role name
     * @author GrowExx
     * @since 12/07/2021
     * @param {Array} data User roles
     * @return {String} Role name
     */
    getUserRoleName (data, ele) {
        if (ele.user_roles.administrator) {
            return this.getMenues(data, 'Administrator');
        } else if (ele.user_roles.manager) {
            return this.getMenues(data, 'Manager');
        } else if (ele.user_roles.information && ele.user_roles.developer) {
            const infoMenu = this.getMenues(data, 'Information');
            const devMenu = this.getMenues(data, 'Developer');
            Array.prototype.push.apply(infoMenu, devMenu);
            return [...new Map(infoMenu.map(item =>
                [item.menu_id, item])).values()];
        } else if (ele.user_roles.information) {
            return this.getMenues(data, 'Information');
        } else if (ele.user_roles.developer) {
            return this.getMenues(data, 'Developer');
        } else {
            return [];
        }
    }

    /**
     * @desc This function is being used to role menus
     * @author GrowExx
     * @since 19/07/2021
     * @param {Array} data User roles
     * @return {String} Role name
     */
    getMenues (data, role) {
        const result = data.Items.filter(obj => {
            return obj.role_name === role;
        });
        return result[0].role_menu;
    }

    /**
     * @desc This function is being used to assign user roles and permission
     * @author GrowExx
     * @since 09/07/2021
     * @param {Object} body Request
     * @param {Array} body.roles User roles
     */
    assignUserRoles (body) {
        try {
            this.getRoles(body).then(async (data)=> {
                body.forEach((ele) => {
                    ele.menu_items = this.getUserRoleName(data, ele);
                });
                this.getMenuesAndAssignPermisions(body);
            });
        } catch (error) {
            Logger.error('assignUserRoles', error);
        }
    }

    /**
     * @desc This function is being used to assign user roles and permission
     * @author GrowExx
     * @since 19/07/2021
     * @param {Array} body Requested users body
     */
    async getMenuesAndAssignPermisions (data) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                const len = element.menu_items.length;
                if (len) {
                    const menuParams = {
                        TableName: 'Menu',
                        FilterExpression: '',
                        ExpressionAttributeValues: {}
                    };
                    element.menu_items.forEach((ele, i) => {
                        menuParams.FilterExpression =
                            `${menuParams.FilterExpression}menu_id = :menu_id${i}${len - 1 !== i ? ' OR ' : ''}`;
                        menuParams.ExpressionAttributeValues[`:menu_id${i}`] = ele.menu_id;
                    });
                    const result = await docClient.scan(menuParams).promise();
                    result.Items = Array.isArray(result.Items) ? result.Items : [];
                    this.updateMenuPermissions(result.Items, element.user_id);
                } else {
                    this.updateMenuPermissions([], element.user_id);

                }
            }
        }
    }

    /**
     * @desc This function is being used to update users menu permisions
     * @author GrowExx
     * @since 19/07/2021
     * @param {Array} menus User menus
     * @param {String} userId User Id
     */
    async updateMenuPermissions (menus, userId) {
        var params = {
            TableName: 'Menu_permissions',
            Item: {
                id: UUID.v4(),
                user_id: userId,
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
     * @desc This function is being used to validate update user role request
     * @author GrowExx
     * @since 14/07/2021
     * @param {Object} body RequestBody
     * @param {String} body.email User email
     * @param {String} body.first_name First name
     * @param {Object} body.user_roles Last name
     * @return {promise}
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            let isValid = true;
            const itemsArray = [];
            if (!Array.isArray(body)) {
                reject(Message.INVALID_REQUEST);
            }
            for (const index in body) {
                if (Object.hasOwnProperty.call(body, index)) {
                    const ele = body[index];
                    if (!ele.email || !ele.user_roles || !ele.user_id) {
                        isValid = false;
                    }
                }
            }
            if (isValid) {
                resolve(itemsArray);
            } else {
                reject(Message.INVALID_REQUEST);
            }
        });
    }
}
module.exports.UpdateUsersRoleHandler = async (event, context, callback) =>
    new UpdateUsersRoleHandler().updateUsersRoleHandler(event, context, callback);
