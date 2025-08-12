const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const Logger = require('../utils/logger');
const ssm = new AWS.SSM();
const params = {
    Name: 'JWT_SECRET',
    WithDecryption: true
};
/**
 * @name Authorizer class
 * @author Innovify
 */
class Authorizer {
    async authorizer (event, context, callback) {
        const token = event.authorizationToken;
        if (!token) {
            Logger.error('Authorizer:token', event);
            callback(null, 'Unauthorized');
        }
        try {
            const key = await ssm.getParameter(params).promise();
            await jwt.verify(token, key.Parameter.Value);
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
