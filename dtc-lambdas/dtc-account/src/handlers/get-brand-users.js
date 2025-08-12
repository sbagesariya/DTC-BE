const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name CreateBrandUserWithRoles class
 * @author GrowExx
 */
class GetBrandUsersHandler {
    /**
     * @desc This function is being used to get brand users
     * @author GrowExx
     * @since 13/07/2021
     */
    async getBrandUsersHandler () {
        try {
            var params = {
                TableName: 'Portal_users',
                FilterExpression: 'user_type = :user_type',
                ExpressionAttributeValues: {
                    ':user_type': 'brand'
                },
                ProjectionExpression: 'email, user_id, first_name, last_name, user_type, created_by, user_roles'
            };
            const data = await docClient.scan(params).promise();
            return Utils.successResponse(data.Items);
        } catch (error) {
            Logger.error('getUserBrandRolesRoles:catch', error);
            return Utils.errorResponse(null, error);
        }

    }
}
module.exports.GetBrandUsersHandler = async (event, context, callback) =>
    new GetBrandUsersHandler().getBrandUsersHandler(event, context, callback);
