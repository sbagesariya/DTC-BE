/**
 * @desc Class represent generic function to post item into table
 * @since 10/12/2020
 */
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/constant');
const tableNames = process.env.TABLE_NAMES;
class PostItem {

    /**
     * @desc This function is being used to insert items into table
     * @author Innovify
     * @since 11/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.tableName Table name
     * @param {Object} req.body.body Insert body data
     */
    async postItem (event) {
        const tables = tableNames.split(',');
        const reqObj = JSON.parse(event.body);
        if (tables.indexOf(reqObj.tableName) !== -1) {
            var params = {
                TableName: reqObj.tableName,
                Item: reqObj.body
            };
            try {
                const result = await docClient.put(params).promise();
                return Utils.successResponse(result, Message.COMMON.INSERTED_SUCCESSFULLY);
            } catch (error) {
                return Utils.errorResponse(Message.COMMON.SOMETHING_WENT_WRONG, error);
            }
        } else {
            return Utils.errorResponse(Message.COMMON.TABLE_NOT_FOUND);
        }
    }
}

module.exports.PostItemHandler = async (event) => new PostItem().postItem(event);
