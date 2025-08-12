const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AssignBrandUserRolePermission class
*/
class AssignBrandUserRolePermission {

    /**
     * Function to get add brand user assign role & menu permission
     *
     * @param {*} req
     * @param {*} context
     * @param {*} callback
     */
    async assignBrandUserRolePermission (req, context, callback) {
        try {
            const usersRole = [
                {
                    email: 'dcleverley0@wunderground.com',
                    role: 'Administrator',
                    user_roles: {
                        'administrator': true,
                        'manager': true,
                        'information': true,
                        'developer': true
                    }
                },
                {
                    email: 'aderrickh@mozilla.com',
                    role: 'Manager',
                    user_roles: {
                        'administrator': false,
                        'manager': true,
                        'information': true,
                        'developer': true
                    }
                }
            ];
            return this.assignUserRole(usersRole).then(async () => {
                return callback(null, Utils.successResponse({}));
            });
        } catch (error) {
            Logger.error('assignBrandUserRolePermission:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add retailer profile menu
     * @param {Object} usersRole Users Role
    */
    async assignUserRole (usersRole) {
        return new Promise(async (resolve) => {
            usersRole.forEach(async (item) => {
                const params = {
                    TableName: 'Portal_users',
                    KeyConditionExpression: 'email = :email',
                    ExpressionAttributeValues: {
                        ':email': item.email
                    }
                };
                const users = await docClient.query(params).promise();
                if (users.Count > 0) {
                    const userId = users.Items[0].user_id;
                    const updateParams = {
                        TableName: 'Portal_users',
                        Key: { email: item.email },
                        UpdateExpression: 'SET user_roles = :user_roles',
                        ExpressionAttributeValues: {
                            ':user_roles': item.user_roles
                        }
                    };
                    await docClient.update(updateParams).promise();
                    await this.prepareUserMenuPermissions(userId, item.role);
                }
            });
            resolve();
        });
    }

    /**
     * Function to assign user menu Permissions
     * @param {String} userId User Id
     * @param {String} role Role
     */
    async prepareUserMenuPermissions (userId, role) {
        const params = {
            TableName: 'Roles',
            FilterExpression: 'role_name = :role_name',
            ExpressionAttributeValues: { ':role_name': role },
            ProjectionExpression: 'role_menu'
        };
        const rolesData = await docClient.scan(params).promise();
        const menus = rolesData.Items[0].role_menu;
        const menuIds = menus.map(obj => obj.menu_id);
        var brandData = [];
        var profileData = [];
        for (const key in menuIds) {
            if (Object.hasOwnProperty.call(menuIds, key)) {
                const menuId = menuIds[key];
                const menuParams = {
                    TableName: 'Menu',
                    KeyConditionExpression: 'menu_id = :menu_id',
                    ExpressionAttributeValues: {
                        ':menu_id': menuId
                    }
                };
                const menuData = await docClient.query(menuParams).promise();
                const items = menuData.Items[0];
                if (items.menu_category === 'brand_profile_menu') {
                    profileData.push(items);
                } else {
                    brandData.push(items);
                }
            }
        }
        await this.assignUserMenuPermissions(userId, profileData, brandData);
    }

    /**
     * Function to assign user menu Permissions
     * @param {String} userId User Id
     * @param {Array} profileData profileData
     * @param {Array} brandData brandData
     */
    async assignUserMenuPermissions (userId, profileData, brandData) {
        const profileMenuParams = {
            TableName: 'Menu',
            FilterExpression: 'menu_category = :menu_category AND menu_name IN(:account_menu_name, :logout_menu_name)',
            ExpressionAttributeValues: {
                ':menu_category': 'brand_profile_menu',
                ':account_menu_name': 'Account',
                ':logout_menu_name': 'Log Out'
            }
        };
        const profileMenu = await docClient.scan(profileMenuParams).promise();
        const profileMenuData = profileMenu.Items;
        const profileMenuItems = [...profileData, ...profileMenuData];
        var permissionParams = {
            TableName: 'Menu_permissions',
            KeyConditionExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': userId
            }
        };
        const permissionData = await docClient.query(permissionParams).promise();
        if (permissionData.Count > 0) {
            const items = permissionData.Items[0];
            items.profile_items = profileMenuItems;
            items.menu_items = brandData;
            const menuParams = {
                TableName: 'Menu_permissions',
                Item: items
            };
            await docClient.put(menuParams).promise();
        }
    }
}
module.exports.assignBrandUserRolePermissionHandler = async (event, context, callback) =>
    new AssignBrandUserRolePermission().assignBrandUserRolePermission(event, context, callback);
