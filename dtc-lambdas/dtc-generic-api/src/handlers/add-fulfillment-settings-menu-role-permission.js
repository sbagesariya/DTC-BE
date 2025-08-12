const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddFulfillmentSettingsMenuRolePermission class
*/
class AddFulfillmentSettingsMenuRolePermission {

    /**
     * Function to add Fulfillment Settings menu in roles & menu permissions tables
     *
     * @param {*} req
     * @param {*} context
     * @param {*} callback
     */
    async addFulfillmentSettingsMenuRolePermission (req, context, callback) {
        try {
            const menuItems = await this.getMenuItem();
            await this.addMenuItemInRoles();
            await this.assignUserMenuPermissions(menuItems);
            return callback(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('updateUserMenuPermission:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async getMenuItem () {
        return [
            {
                menu_id: '98af4037-2a58-4248-a128-fcded148ac64',
                menu_category: 'brand',
                menu_name: 'Fulfillment Center',
                menu_description: '',
                menu_icon: 'fas fa-dolly',
                menu_link: '',
                order_n: 14,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }, {
                menu_id: '9cce1c56-35ea-4b8c-b1e1-2448732df378',
                menu_category: 'brand',
                menu_name: 'Zones & Rates',
                menu_description: '',
                menu_icon: '',
                menu_link: '/cms/zones-rates',
                order_n: 15,
                parent_id: '98af4037-2a58-4248-a128-fcded148ac64',
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            },
            {
                menu_id: 'bbc8593b-69a2-4e3a-8b6b-c1ab77d60263',
                menu_category: 'brand',
                menu_name: 'Inventory',
                menu_description: '',
                menu_icon: '',
                menu_link: '/cms/inventory',
                order_n: 16,
                parent_id: '98af4037-2a58-4248-a128-fcded148ac64',
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
        ];
    }
    /**
     * Function to add menu in roles table
     * @param {Object} menuItems Menu Items
     */
    async addMenuItemInRoles () {
        const menu = [{
            menu_id: '98af4037-2a58-4248-a128-fcded148ac64',
            menu_name: 'Fulfillment Center'
        }, {
            menu_id: '9cce1c56-35ea-4b8c-b1e1-2448732df378',
            menu_name: 'Zones & Rates'
        }, {
            menu_id: 'bbc8593b-69a2-4e3a-8b6b-c1ab77d60263',
            menu_name: 'Inventory'
        }];
        const params = {
            TableName: 'Roles',
            FilterExpression: 'role_name IN(:admin_role, :manager_role)',
            ExpressionAttributeValues: {
                ':admin_role': 'Administrator',
                ':manager_role': 'Manager'
            }
        };
        const roles = await docClient.scan(params).promise();
        roles.Items.forEach(async (data) => {
            if (!(data.role_menu.some(menu => menu.menu_name === 'Fulfillment Center'))) {
                data.role_menu = [...data.role_menu, ...menu];
                const roleParams = {
                    TableName: 'Roles',
                    Item: data
                };
                await docClient.put(roleParams).promise();
            }
        });
    }

    /**
     * Function to assign menu permissions
     * @param {Object} menuItems Menu Items
     */
    async assignUserMenuPermissions (menuItems) {
        const params = {
            TableName: 'Portal_users',
            FilterExpression: 'user_type = :user_type AND (user_roles.administrator = :role OR user_roles.manager = :role)',
            ExpressionAttributeValues: { ':user_type': 'brand', ':role': true },
            ProjectionExpression: 'user_id'
        };
        const users = await docClient.scan(params).promise();
        const userIds = users.Items.map(obj => obj.user_id);
        userIds.forEach(async (userId) => {
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
                if (!(items.menu_items.some(menu => menu.menu_name === 'Fulfillment Center'))) {
                    items.menu_items = [...items.menu_items, ...menuItems];
                    const menuParams = {
                        TableName: 'Menu_permissions',
                        Item: items
                    };
                    await docClient.put(menuParams).promise();
                }
            }
        });
    }
}
module.exports.addFulfillmentSettingsMenuRolePermissionHandler = async (event, context, callback) =>
    new AddFulfillmentSettingsMenuRolePermission().addFulfillmentSettingsMenuRolePermission(event, context, callback);
