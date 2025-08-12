const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddFulfillmentPreferenceMenuInRoles class
*/
class AddFulfillmentPreferenceMenuInRoles {

    /**
     * Function to get and add Fulfillment PreferenceMenu In Roles table
     *
     * @param {*} req
     * @param {*} context
     * @param {*} callback
     */
    async addFulfillmentPreferenceMenuInRoles (req, context, callback) {
        try {
            const params = {
                TableName: 'Roles',
                FilterExpression: 'role_name IN(:admin_role, :manager_role)',
                ExpressionAttributeValues: {
                    ':admin_role': 'Administrator',
                    ':manager_role': 'Manager'
                }
            };
            const rolesData = await docClient.scan(params).promise();
            rolesData.Items.forEach(async (data) => {
                const roleMenuData = data.role_menu;
                const preferenceMenu = [{
                    menu_id: 'ae19cb4e-1d86-4ca4-b493-8a9fa794cd24',
                    menu_name: 'Fulfillment Preference'
                }];
                const roleMenu = [...roleMenuData, ...preferenceMenu];
                data.role_menu = roleMenu;
                const roleParams = {
                    TableName: 'Roles',
                    Item: data
                };
                await docClient.put(roleParams).promise();
            });
            return callback(null, Utils.successResponse());
        } catch (error) {
            Logger.error('addFulfillmentPreferenceMenuInRoles:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.addFulfillmentPreferenceMenuInRolesHandler = async (event, context, callback) =>
    new AddFulfillmentPreferenceMenuInRoles().addFulfillmentPreferenceMenuInRoles(event, context, callback);
