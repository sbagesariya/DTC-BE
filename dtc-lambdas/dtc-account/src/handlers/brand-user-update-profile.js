const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const Bcrypt = require('../../utils/bcrypt');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

/**
 * @name BrandUserUpdateProfile class
*/
class BrandUserUpdateProfile {

    /**
     * @desc This function is being used to update brand user profile
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.first_name User first name
     * @param {String} req.body.last_name User last name
     * @param {Object} req.body.profilePicture User profile picture
     * @param {Object} req.body.removeProfilePicture User remove profile picture
     * @param {String} req.body.password User password
     * @param {String} req.body.new_password User new password
     * @param {String} req.body.confirm_password User confirm password
     */
    async brandUserUpdateProfile (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (user) => {
            return this.updateAccountDetails(body, user, callback);
        }).catch((err) => {
            Logger.error('brandUserUpdateProfile:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate update brand user password request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!body.first_name) {
                reject(Message.FIRST_NAME_REQUIRED);
            } else {
                this.validatePasswordRequest(body, resolve, reject);
            }
        });
    }

    /**
      * @desc This function is being used to validate update brand user password request
    */
    async validatePasswordRequest (body, resolve, reject) {
        if (body.password && !body.new_password) {
            reject(Message.NEW_PASSWORD_REQUIRED);
        } else if (body.password && !body.confirm_password) {
            reject(Message.CONFIRM_PASSWORD_REQUIRED);
        } else if (body.password && (body.new_password !== body.confirm_password)) {
            reject(Message.PWD_NOT_MATCH);
        } else {
            var params = {
                TableName: 'Portal_users',
                KeyConditionExpression: 'email = :email',
                FilterExpression: 'user_type = :user_type',
                ExpressionAttributeValues: {
                    ':email': body.email,
                    ':user_type': 'brand'
                }
            };
            const user = await docClient.query(params).promise();
            if (user.Count === 0) {
                reject(Message.USER_NOT_FOUND);
            } else {
                resolve(user.Items[0]);
            }
        }
    }

    /**
    * @desc This function is being used to update brand user account details
    * @param {Object} req.body RequestBody
    * @param {Object} user user
    */
    async updateAccountDetails (body, user, callback) {
        try {
            const params = {
                TableName: 'Portal_users',
                Key: { email: user.email },
                UpdateExpression: 'SET first_name = :first_name, last_name = :last_name, profilePicture = :profilePicture',
                ExpressionAttributeValues: {
                    ':first_name': body.first_name,
                    ':last_name': body.last_name,
                    ':profilePicture': body.profilePicture
                }
            };
            await docClient.update(params).promise();
            if (body.password) {
                return this.updatePassword(body, user);
            }
            this.deleteS3File(body);
            const response = { ... body };
            delete response.password;
            delete response.new_password;
            delete response.confirm_password;
            response.user_roles = user.user_roles;
            return callback(null, Utils.successResponse(response));
        } catch (error) {
            Logger.error('updateAccountDetails:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to update brand user password
    * @param {Object} req.body RequestBody
    * @param {Object} user user
    */
    async updatePassword (body, user) {
        return Bcrypt.comparePassword(body.password, user.password).then(async ()=> {
            try {
                const newPassword = await Bcrypt.enCryptPassword(body.confirm_password);
                const params = {
                    TableName: 'Portal_users',
                    Key: { email: user.email },
                    UpdateExpression: 'SET password = :password',
                    ExpressionAttributeValues: {
                        ':password': newPassword
                    }
                };
                await docClient.update(params).promise();
                return Utils.successResponse();
            } catch (error) {
                Logger.error('brandUserUpdatePassword:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('brandUserUpdatePassword:comparePassword', err);
            return Utils.errorResponse(Message.WRONG_OLD_PASSWORD_REQUIRED, { 'password': false });
        });
    }

    /**
    * @desc This function is being used to delete file from s3 bucket
    * @param {Object} req Request
    * @param {Object} req.body Body
    */
    deleteS3File (body) {
        if (body.removeProfilePicture) {
            if (body.removeProfilePicture) {
                const params = {
                    Bucket: process.env.BucketName,
                    Key: body.removeProfilePicture
                };
                s3.deleteObject(params, (err) => {
                    if (err) {
                        Logger.error('deleteS3File:', err);
                    } else {
                        Logger.info('deleteS3File:', body.removeProfilePicture);
                    }
                });
            }
            delete (body.removeProfilePicture);
        }
    }
}
module.exports.BrandUserUpdateProfileHandler = async (event, context, callback) =>
    new BrandUserUpdateProfile().brandUserUpdateProfile(event, context, callback);
