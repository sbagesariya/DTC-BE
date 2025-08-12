const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddRetailerProfileMenu class
 */
class AddRetailerProfileMenu {

    /**
     * Function to get add retailer profile menu & assign permission
     *
     * @param {*} req
     * @param {*} context
     * @param {*} callback
     */
    async addRetailerProfileMenu (req, context, callback) {
        try {
            const menuItems = this.getProfileMenuItem();
            await this.addProfileMenuItem(menuItems);
            await this.assignRetailerUserPermissions(menuItems);
            return callback(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('addRetailerProfileMenu:catch', error);
            return Utils.errorResponse(error);
        }
    }

    getProfileMenuItem () {
        return [
            {
                menu_id: '34303c87-3f58-412a-999e-6e1ff664efae',
                menu_category: 'retailer_profile_menu',
                menu_name: 'Account',
                menu_description: '',
                menu_icon: '',
                menu_link: '/cms/retailer/account',
                order_n: 1,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }, {
                menu_id: 'dc65b254-46eb-444f-826d-a1e313591179',
                menu_category: 'retailer_profile_menu',
                menu_name: 'Log Out',
                menu_description: '',
                menu_icon: '',
                menu_link: '/portal',
                order_n: 2,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
        ];
    }

    /**
     * Function to add retailer profile menu
     * @param {Object} menuItems Menu Items
     */
    async addProfileMenuItem (menuItems) {
        menuItems.forEach(async (items) => {
            const params = {
                TableName: 'Menu',
                Item: items
            };
            await docClient.put(params).promise();
        });
    }

    /**
     * Function to assign retailer profile menu
     * @param {Object} menuItems Menu Items
     */
    async assignRetailerUserPermissions (menuItems) {
        const params = {
            TableName: 'Portal_users',
            FilterExpression: 'user_type = :user_type',
            ExpressionAttributeValues: { ':user_type': 'retailer' },
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
                items.profile_items = menuItems;
                const menuParams = {
                    TableName: 'Menu_permissions',
                    Item: items
                };
                await docClient.put(menuParams).promise();
            }
        });
    }
}

module.exports.addRetailerProfileMenuHandler = async (event, context, callback) =>
    new AddRetailerProfileMenu().addRetailerProfileMenu(event, context, callback);
