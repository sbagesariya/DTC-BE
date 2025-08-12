
const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const ParameterStore = require('./ssm');

module.exports = class Encrypt {
    static async enCryptPassword (password) {
        try {
            const KeyId = await ParameterStore.getValue('login_kms');
            const Plaintext = password;
            const result = await kms.encrypt({ KeyId, Plaintext }).promise();
            const { CiphertextBlob } = result;
            return CiphertextBlob.toString('base64');
        } catch (error) {
            return error;
        }
    }
};
