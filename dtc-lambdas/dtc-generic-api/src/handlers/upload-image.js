/**
 * @desc Class represent generic function to upload image
 * @since 08/02/2020
 */
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/constant');
const AWS = require('aws-sdk');
const Logger = require('./../../utils/logger');
const s3 = new AWS.S3();
class UploadImage {

    /**
     * @desc This function is being used to upload image to s3 bucker
     * @author Innovify
     * @since 08/02/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.tableName Table name
     * @param {Object} req.body.body Insert body data
     */
    async uploadImage (req) {
        const reqObj = JSON.parse(req.body);
        const name = reqObj.name ? `${reqObj.name}-` : '';
        const extension = reqObj.extension ? `.${reqObj.extension}` : '';
        const fileName = `${name}${(Date.now()).toString()}${extension}`;
        try {
            const buf = Buffer.from(reqObj.file.replace(/^data:image\/\w+;base64,/, ''), 'base64');
            const data = {
                Bucket: process.env.BucketName,
                Key: fileName,
                Body: buf,
                ContentEncoding: 'base64',
                ContentType: `image/${extension}`
            };
            const results = await s3.putObject(data).promise();
            if (results && results.stack) {
                Logger.error('uploadImage putObject error', results.stack);
                return Utils.errorResponse('', results);
            }
            return Utils.successResponse({ file_name: `${process.env.BucketURL}/${data.Key}` });
        } catch (error) {
            Logger.error('uploadImage catch block', error);
            return Utils.errorResponse('', error);
        }
    }
}

module.exports.UploadImageHandler = async (event, context, callback) => new UploadImage().uploadImage(event, context, callback);
