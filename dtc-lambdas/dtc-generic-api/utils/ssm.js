
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

/**
 * @name ParameterStore Utils
 *
 * This class reprasents parameter store configuration
*/
class ParameterStore {
    static async getValue (keyName) {
        const params = {
            Name: keyName,
            WithDecryption: true
        };
        const key = await ssm.getParameter(params).promise();
        return key.Parameter.Value;
    }
}

module.exports = ParameterStore;
