const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetUserRoles class
 */
class GetUserRoles {

    /**
     * @desc This function is being used to to get User Roles
     */
    async getUserRoles () {
        try {
            var params = {
                TableName: 'Roles',
                AttributesToGet: ['role_id', 'role_name', 'role_desc']
            };
            const data = await docClient.scan(params).promise();
            const roleData = data.Items;
            roleData.sort((a, b) => (a.order_n > b.order_n ? 1 : -1));
            return Utils.successResponse(roleData);
        } catch (error) {
            Logger.error('getUserRoles:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getUserRolesHandler = async () => new GetUserRoles().getUserRoles();
