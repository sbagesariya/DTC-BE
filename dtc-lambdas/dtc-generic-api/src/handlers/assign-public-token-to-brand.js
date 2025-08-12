const Utils = require('../../utils/lambda-response');
const UUID = require('uuid');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Encrypt = require('./../../utils/encription');

/**
 * @name AssignPublicTokenToNewBrand class
 * @author GrowExx
 */
class AssignPublicTokenToNewBrand {
    assignToken (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (brand) => {
            this.assignTokenToBrand(brand);
            return callback(null, Utils.successResponse('Success!'));
        }).catch((err) => {
            Logger.error('assignTone', err);
            return Utils.errorResponse(err);
        });

    }

    /**
     * @desc This function is being used to validate request
     * @author GrowExx
     * @since 22/10/2021
     * @param {Object} body RequestBody
     * @param {String} body.brand_id Brand Id
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                const user = await this.checkCustomer(body.brand_id);
                if (user.length === 0) {
                    reject(Message.USER_NOT_FOUND);
                } else if (user[0].user_type !== 'brand') {
                    reject(Message.NOT_BRAND);
                } else {
                    resolve(user[0]);
                }
            }
        });
    }

    async checkCustomer (brandId) {
        var params = {
            TableName: 'Portal_users',
            KeyConditionExpression: 'user_id = :user_id',
            IndexName: 'user_id-index',
            ExpressionAttributeValues: {
                ':user_id': brandId
            },
            ProjectionExpression: 'user_id, user_type'
        };
        const data = await docClient.query(params).promise();
        return data.Items;
    }

    async assignTokenToBrand (brand) {
        const tempPassword = UUID.v4();
        const pwd = await Encrypt.enCryptPassword(tempPassword);
        try {
            var params = {
                TableName: 'Public_api_tokens',
                Item: {
                    brand_id: brand.user_id,
                    secret_token: pwd,
                    createdAt: ((new Date()).getTime()),
                    updatedAt: ((new Date()).getTime()),
                    active: 1
                }
            };
            docClient.put(params).promise();
        } catch (error) {
            Logger.error('AssignToken:catch', error);
        }
    }
}
module.exports.AssignPublicTokenToNewBrandHandler = async (req, context, callback) =>
    new AssignPublicTokenToNewBrand().assignToken(req, context, callback);
