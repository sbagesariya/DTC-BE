const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const UUID = require('uuid');

/**
 * @name SaveRetailerShippingLimits class
 */
class SaveRetailerShippingLimits {

    /**
     * Function to save shipping limits
     *
     * @param {Object} req.email String
     * @param {Object} req.delivery_addresses Object
     */
    async saveShippingLimits (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then((user) => {
            return this.saveShippingData(body, user).then(async () => {
                if (body.remove_addresses) {
                    await this.removeAddressData(body.remove_addresses);
                }
                const result = {};
                result.retailer_addresses = await this.getRetailAddressDetail(user.user_id);
                return callback(null, Utils.successResponse(result));
            });
        }).catch((err) => {
            Logger.error('saveShippingLimits:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * Function to save shipping limits
     *
     * @param {Object} body Object
     * @param {Object} user Object
     */
    async saveShippingData (body, user) {
        return new Promise(async (resolve) => {
            var shippingLimits = body.shipping_limits;
            for (const key in shippingLimits) {
                if (Object.hasOwnProperty.call(shippingLimits, key)) {
                    const element = shippingLimits[key];
                    var data = {};
                    if (element.address_id) {
                        data = await this.getAddressData(user.user_id, element.address_id);
                        delete element.address_id;
                        data.shipping_limit = element;
                    } else {
                        data.address_id = UUID.v1();
                        data.retailer_id = user.user_id;
                        data.createdAt = new Date().getTime();
                        data.shipping_limit = element;
                    }
                    data.is_shipping_limit = true;
                    data.updatedAt = new Date().getTime();
                    const RetailerParams = {
                        TableName: 'Retailers_addresses',
                        Item: data
                    };
                    await docClient.put(RetailerParams).promise();
                }
            }
            resolve();
        });
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
        try {
            for (const key in addressIds) {
                if (Object.hasOwnProperty.call(addressIds, key)) {
                    const item = addressIds[key];
                    const params = {
                        TableName: 'Retailers_addresses',
                        Key: {
                            retailer_id: item.retailer_id,
                            createdAt: item.createdAt
                        },
                        ConditionExpression: 'address_id = :address_id',
                        ExpressionAttributeValues: {
                            ':address_id': item.address_id
                        }
                    };
                    await docClient.delete(params).promise();
                }
            }
        } catch (error) {
            Logger.error('removeAddressData:catch', error);
        }
    }

    /**
     * @desc This function is being used to validate update retailer require information
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.email) {
                reject(Message.EMAIL_REQUIRED);
            } else if (!body.shipping_limits) {
                reject(Message.SHIPING_LIMITS_REQUIRED);
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
        });
    }

    async getRetailAddressDetail (userId) {
        const params = {
            TableName: 'Retailers_addresses',
            KeyConditionExpression: 'retailer_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': userId
            }
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }
}

module.exports.SaveRetailerShippingLimitsHandler = async (event, context, callback) =>
    new SaveRetailerShippingLimits().saveShippingLimits(event, context, callback);
