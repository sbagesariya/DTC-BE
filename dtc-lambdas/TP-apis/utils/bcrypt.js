
const AWS = require('aws-sdk');
const kms = new AWS.KMS();

module.exports = class Bcrypt {
    static comparePassword (password, userPassword) {
        return new Promise((resolve, reject) => {
            try {
                kms.decrypt({ CiphertextBlob:
                    Buffer.from(userPassword, 'base64') },
                (err, data) => {
                    let decryptedData;
                    if (data && data.Plaintext) {
                        decryptedData = data.Plaintext.toString('ascii');
                    }
                    password === decryptedData ? resolve(true) : reject('Unathorised');
                });
            } catch (error) {
                reject(error);
            }
        });
    }
};
