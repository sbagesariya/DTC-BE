const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetTemplateList class
 * @author Innovify
 */
class GetTemplateList {
    /**
   * @desc This function is being used to to get Templates from template master table
   * @author Innovify
   * @since 04/02/2021
   */
    async getTemplateList () {
        try {
            var params = {
                TableName: 'Template_master'
            };
            const data = await docClient.scan(params).promise();
            return Utils.successResponse(data.Items);
        } catch (error) {
            Logger.error('getTemplate:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getAllTemplatesHandler = async (event, context, callback) => new GetTemplateList().getTemplateList(event, context, callback);
