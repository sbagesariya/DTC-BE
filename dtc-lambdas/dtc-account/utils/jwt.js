/**
 * JSON Web Token class is responsible for creating the JSON Web Token
 * @name JsonWebToken
 */
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();
const params = {
    Name: 'JWT_SECRET',
    WithDecryption: true
};
class JsonWebToken {
    static async generate (data) {
        const tokenOptionalInfo = {
            algorithm: 'HS256',
            // 3 Hours
            expiresIn: 60 * 60 * 24
        };
        const key = await ssm.getParameter(params).promise();
        return jwt.sign(data, key.Parameter.Value, tokenOptionalInfo);
    }
}

module.exports = JsonWebToken;
