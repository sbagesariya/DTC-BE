const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const Bcrypt = require('../../utils/bcrypt');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const UUID = require('uuid');

/**
 * @name RetailerUserUpdateProfile class
 */
class RetailerUserUpdateProfile {

    /**
     * @desc This function is being used to update retailer user profile
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.email User email
     * @param {String} req.body.first_name User first name
     * @param {String} req.body.last_name User last name
     * @param {Object} req.body.primary_address User primary address
     * @param {Object} req.body.addresses User addresses
     * @param {String} req.body.password User password
     * @param {String} req.body.new_password User new password
     * @param {String} req.body.confirm_password User confirm password
     */
    async retailerUserUpdateProfile (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (user) => {
            return this.updateAccountDetails(body, user, callback);
        }).catch((err) => {
            Logger.error('retailerUserUpdateProfile:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate update retailer user password request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!body.first_name || !body.last_name) {
                reject(Message.NAME_REQUIRED);
            } else if (!body.primary_address) {
                reject(Message.PRIMARY_ADDRESS_REQUIRED);
            } else if (!body.phone) {
                reject(Message.PHONE_REQUIRED);
            } else {
                this.validatePasswordRequest(body, resolve, reject);
            }
        });
    }

    /**
      * @desc This function is being used to validate update retailer user password request
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
                ExpressionAttributeValues: {
                    ':email': body.email
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
    * @desc This function is being used to update retailer
    * @param {Object} req.body RequestBody
    * @param {Object} user user
    */
    async updateAccountDetails (body, user, callback) {
        try {
            const params = {
                TableName: 'Portal_users',
                Key: { email: user.email },
                UpdateExpression: 'SET first_name = :first_name, last_name = :last_name, phone = :phone',
                ExpressionAttributeValues: {
                    ':first_name': body.first_name,
                    ':last_name': body.last_name,
                    ':phone': body.phone
                }
            };
            await docClient.update(params).promise();
            await this.updateRetailerDetails(body, user);
            if (body.password) {
                return this.updatePassword(body, user);
            }
            const response = { ... body };
            delete response.password;
            delete response.new_password;
            delete response.confirm_password;
            return callback(null, Utils.successResponse(response));
        } catch (error) {
            Logger.error('updateAccountDetails:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to update retailer
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
                Logger.error('retailerUserUpdatePassword:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('retailerUserUpdatePassword:comparePassword', err);
            return Utils.errorResponse(Message.WRONG_OLD_PASSWORD_REQUIRED, { 'password': false });
        });
    }

    /**
    * @desc This function is being used to update retailer details
    * @param {Object} req.body RequestBody
    * @param {Object} user user
    */
    async updateRetailerDetails (body, user) {
        var params = {
            TableName: 'Retailers',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': user.user_id
            }
        };
        const retailerData = await docClient.query(params).promise();
        var data = {};
        if (retailerData.Count > 0) {
            data = retailerData.Items[0];
        } else {
            data.retailer_id = user.user_id;
            data.createdAt = new Date().getTime();
        }
        data.retailer_name = `${body.first_name} ${body.last_name}`;
        data.primary_address = body.primary_address;
        data.updatedAt = new Date().getTime();
        const RetailerParams = {
            TableName: 'Retailers',
            Item: data
        };
        await docClient.put(RetailerParams).promise();
        if (body.remove_addresses) {
            await this.removeAddressData(body.remove_addresses);
        }
        if (body.addresses) {
            await this.saveRetailerAddresses(body, user);
        }
    }

    /**
    * @desc This function is being used to save retailer addresses
    * @param {Object} req.body RequestBody
    * @param {Object} user user
    */
    async saveRetailerAddresses (body, user) {
        try {
            var addressesData = body.addresses;
            addressesData.forEach(async (element) => {
                var data = {};
                if (element.address_id) {
                    data = await this.getAddressData(user.user_id, element.address_id);
                    delete element.address_id;
                    data.address = element;
                } else {
                    data.address_id = UUID.v1();
                    data.retailer_id = user.user_id;
                    data.createdAt = new Date().getTime();
                    data.address = element;
                }
                data.is_shipping_limit = false;
                data.updatedAt = new Date().getTime();
                const RetailerParams = {
                    TableName: 'Retailers_addresses',
                    Item: data
                };
                await docClient.put(RetailerParams).promise();
            });
        } catch (error) {
            Logger.error('saveRetailerAddresses:catch', error);
        }
    }

    /**
     * Function to get address data
     *
     * @param {String} retailerId
     * @param {String} addressId
    */
    async getAddressData (retailerId, addressId) {
        const Params = {
            TableName: 'Retailers_addresses',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            FilterExpression: 'address_id = :address_id',
            ExpressionAttributeValues: {
                ':address_id': addressId,
                ':retailer_id': retailerId
            }
        };
        var addressData = await docClient.query(Params).promise();
        var data = {};
        if (addressData.Count > 0) {
            data = addressData.Items[0];
        }
        return data;
    }

    /**
     * Function to remove addresses
     *
     * @param {Object} addressIds
     */
    async removeAddressData (addressIds) {
        addressIds.forEach((item) => {
            try {
                docClient.delete(
                    {
                        TableName: 'Retailers_addresses',
                        Key: {
                            retailer_id: item.retailer_id,
                            createdAt: item.createdAt
                        },
                        ConditionExpression: 'address_id = :address_id',
                        ExpressionAttributeValues: {
                            ':address_id': item.address_id
                        }
                    }).promise();
            } catch (error) {
                Logger.error('removeAddressData:catch', error);
            }
        });
    }
}

module.exports.RetailerUserUpdateProfileHandler = async (event, context, callback) =>
    new RetailerUserUpdateProfile().retailerUserUpdateProfile(event, context, callback);
