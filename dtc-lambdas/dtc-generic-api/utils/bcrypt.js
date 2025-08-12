
const AWS = require('aws-sdk');
const kms = new AWS.KMS();
const ParameterStore = require('./ssm');

module.exports = class Bcrypt {
    static enCryptPassword (password) {
        return new Promise(async (resolve, reject) => {
            try {
                const KeyId = await ParameterStore.getValue('login_kms');
                const Plaintext = password;
                kms.encrypt({ KeyId, Plaintext }, (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const { CiphertextBlob } = data;
                        resolve(CiphertextBlob.toString('base64'));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    static comparePassword (password, userPassword) {
        return new Promise((resolve, reject) => {
            try {
                kms.decrypt({ CiphertextBlob:
                    Buffer.from(userPassword, 'base64') },
                (err, data) => {
                    var decryptedData = data.Plaintext.toString('ascii');
                    password === decryptedData ? resolve(true) : reject('Unathorised');
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};
