const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const Logger = require('../utils/logger');
const Constant = require('./../utils/constants');
const ssm = new AWS.SSM();
const params = {
    Name: 'JWT_SECRET',
    WithDecryption: true
};
/**
 * @name Authorizer class
 * @author GrowExx
 */
class Authorizer {
    async authorizer (event, context, callback) {
        const token = event.headers.Authorization;
        if (!token) {
            Logger.error('Authorizer:token', event);
            callback(null, 'Unauthorized');
        }
        try {
            const key = await ssm.getParameter(params).promise();
            const data = await jwt.verify(token, key.Parameter.Value);
            if (data.user_type !== Constant.USER_TYPE || data.id !== event.headers.brand_id) {
                return this.generateAuthResponse('user', 'Deny', '*');
            }
            return this.generateAuthResponse('user', 'Allow', '*');
        } catch (error) {
            Logger.error('Authorizer:catch', error);
            return this.generateAuthResponse('user', 'Deny', '*');
        }
    }

    generateAuthResponse (principalId, effect, methodArn) {
        const policyDocument = this.generatePolicyDocument(effect, methodArn);
        return {
            principalId,
            policyDocument
        };
    }

    // Policy helper function
    generatePolicyDocument (effect, methodArn) {
        return {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: methodArn
            }]
        };
    }
}

module.exports.AuthorizerHandler = async (event, context, callback) => new Authorizer().authorizer(event, context, callback);
