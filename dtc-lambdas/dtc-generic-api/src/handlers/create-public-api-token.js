const Utils = require('../../utils/lambda-response');
const UUID = require('uuid');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Encrypt = require('./../../utils/encription');

/**
 * @name CreatePublicToken class
 * @author GrowExx
 */
class CreatePublicToken {
    async createToken (req, context, callback) {
        try {
            const brands = await this.getBrands();
            brands.forEach(async (element, i) => {
                const tempPassword = UUID.v4();
                const pwd = await Encrypt.enCryptPassword(tempPassword);
                if (typeof pwd === 'string') {
                    try {
                        var params = {
                            TableName: 'Public_api_tokens',
                            Item: {
                                brand_id: element.user_id,
                                secret_token: pwd,
                                createdAt: ((new Date()).getTime()) + parseInt(i),
                                updatedAt: ((new Date()).getTime()) + parseInt(i),
                                active: 1
                            }
                        };
                        docClient.put(params).promise();
                    } catch (error) {
                        Logger.error('AssignToken:catch', error);
                    }
                } else {
                    Logger.error('Password Encryption Error:catch', pwd);
                }
            }, (err)=> {
                Logger.error('iterating done', err);
            });
            return callback(null, Utils.successResponse('Success'));
        } catch (error) {
            Logger.error('createToken:catch', error);
            return callback(null, Utils.errorResponse(error));
        }
    }

    async getBrands () {
        var params = {
            TableName: 'Portal_users',
            FilterExpression: 'user_type = :user_type',
            ExpressionAttributeValues: {
                ':user_type': 'brand'
            },
            ProjectionExpression: 'user_type, user_id'
        };
        const brands = await docClient.scan(params).promise();
        return brands.Items;
    }
}
module.exports.CreatePublicTokenHandler = async (req, context, callback) =>
    new CreatePublicToken().createToken(req, context, callback);
