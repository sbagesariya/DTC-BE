const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name RemoveBrandUser class
 * @author GrowExx
 */
class RemoveBrandUser {

    /**
     * @desc This function is being used to remove brand user & roles
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} req.pathParameters PathParameters
     * @param {String} req.pathParameters.user_id User Id
     */
    async removeBrandUser (req, context, callback) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async (user) => {
            try {
                this.removeBrand(user.user_id);
                this.removeRolePermission(user.user_id);
                this.removeUser(user.email);
                this.removeFulfillmentCenter(user.user_id);
                return callback(null, Utils.successResponse({}, Message.DELETED_SUCCESSFULLY));
            } catch (error) {
                Logger.error('removeBrandUser:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('removeBrandUser:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate remove brand user request
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} req.pathParameters.user_id User Id
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.user_id) {
                reject(Message.USER_ID_REQUIRED);
            } else {
                const params = {
                    TableName: 'Portal_users',
                    IndexName: 'user_id-index',
                    KeyConditionExpression: 'user_id = :user_id',
                    ExpressionAttributeValues: {
                        ':user_id': body.user_id
                    }
                };
                const data = await docClient.query(params).promise();
                if (data.Count > 0) {
                    const userData = data.Items[0];
                    if (userData.user_roles.administrator) {
                        await this.checkAnotherAdminAvailable(userData, reject);
                    }
                    resolve(userData);
                } else {
                    reject(Message.USER_NOT_FOUND);
                }
            }
        });
    }

    /**
     * @desc This function is being used to remove record from brand
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} userId User Id
     */
    async removeBrand (userId) {
        var params = {
            TableName: 'Brands',
            Key: { brand_id: userId }
        };
        await docClient.delete(params).promise();
    }

    /**
     * @desc This function is being used to remove record from menu permissions
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} userId User Id
     */
    async removeRolePermission (userId) {
        var params = {
            TableName: 'Menu_permissions',
            Key: { user_id: userId }
        };
        await docClient.delete(params).promise();
    }

    /**
     * @desc This function is being used to remove record from portal users
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} userEmail User Email
     */
    async removeUser (userEmail) {
        var params = {
            TableName: 'Portal_users',
            Key: { email: userEmail }
        };
        await docClient.delete(params).promise();
    }

    /**
     * @desc This function is being used to remove record from Fulfillment center
     * @author GrowExx
     * @since 01/02/2022
     * @param {String} userId User Id
     */
    async removeFulfillmentCenter (userId) {
        const params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': userId
            }
        };
        const result = await docClient.query(params).promise();
        if (result.Items.length) {
            result.Items.forEach(async (element) => {
                var params = {
                    TableName: 'Fulfillment_centers',
                    Key: { brand_id: element.brand_id, fulfillment_center_id: element.fulfillment_center_id }
                };
                await docClient.delete(params).promise();
            });
        }
    }

    /**
     * @desc This function is being used to user is already available or not
     * @author GrowExx
     * @since 14/07/2021
     * @param {String} user User
     */
    async checkAnotherAdminAvailable (user, reject) {
        const params = {
            TableName: 'Portal_users',
            FilterExpression: 'email <> :email AND user_roles.administrator = :administrator',
            ExpressionAttributeValues: {
                ':email': user.email,
                ':administrator': true
            },
            Select: 'COUNT'
        };
        const data = await docClient.scan(params).promise();
        if (data.Count === 0) {
            reject(Message.ADMIN_ROLE_VALIDATE);
        }
    }
}
module.exports.RemoveBrandUserHandler = async (event, context, callback) =>
    new RemoveBrandUser().removeBrandUser(event, context, callback);
