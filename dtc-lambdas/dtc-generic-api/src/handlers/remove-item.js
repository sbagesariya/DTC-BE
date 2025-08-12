/**
 * @desc Class represent generic function to remove item from table
 * @since 10/12/2020
 */
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/constant');
const tableNames = process.env.TABLE_NAMES;
class RemoveItem {

    /**
     * @desc This function is being used to to remove items from table
     * @author Innovify
     * @since 11/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.tableName Table name
     * @param {String} req.body.hash_key_name Hash key name
     * @param {String} req.body.hash_key_value Hash key value
     * @param {String} req.body.range_key_name Range key name
     * @param {String} req.body.range_key_value Range key value
     */
    async removeItem (req) {
        const tables = tableNames.split(',');
        const reqObj = JSON.parse(req.body);
        if (tables.indexOf(reqObj.tableName) !== -1) {
            if (!reqObj.hash_key_name) {
                return Utils.errorResponse('Hash key name is required');
            } else if (!reqObj.hash_key_value) {
                return Utils.errorResponse('Hash key value is required');
            } else if (!reqObj.range_key_name) {
                return Utils.errorResponse('Range key name is required');
            } else if (!reqObj.range_key_value) {
                return Utils.errorResponse('Range key value is required');
            } else {
                var params = {
                    TableName: reqObj.tableName,
                    Key: {}
                };
                params.Key[reqObj.hash_key_name] = reqObj.hash_key_value;
                params.Key[reqObj.range_key_name] = reqObj.range_key_value;
                try {
                    const result = await docClient.delete(params).promise();
                    return Utils.successResponse(result, Message.COMMON.REMOVED_SUCCESSFULLY);
                } catch (error) {
                    return Utils.errorResponse(Message.COMMON.SOMETHING_WENT_WRONG, error);
                }
            }
        } else {
            return Utils.errorResponse(Message.COMMON.TABLE_NOT_FOUND);
        }
    }
}

module.exports.RemoveItemHandler = async (event) => new RemoveItem().removeItem(event);
