const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');

/**
 * This function is being used to get tempate by Id
 */
exports.getTemplateByIdHandler = async (event) => {
    const id = event.pathParameters.templateid;
    var params = {
        TableName: 'Templates',
        FilterExpression: 'template_id = :template_id',
        ExpressionAttributeValues: {
            ':template_id': id
        },
        ProjectionExpression: 'template_id, banner_text, banner_link, banner_text_color, banner_background_color',
        Limit: 1
    };
    const data = await docClient.scan(params).promise();
    const item = data.Items;
    return Utils.successResponse(item);
};
