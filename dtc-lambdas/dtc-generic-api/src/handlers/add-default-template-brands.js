// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/constant');
const TemplateModel = require('./../../model/templates.model');

var db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
/**
 * A simple example includes a HTTP add default first template for all brands from a DynamoDB table.
 */
exports.addDefaultTemplateBrandsHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`Method only accept POST method, you tried: ${event.httpMethod}`);
    }
    var params = {
        TableName: 'Template_master',
        FilterExpression: 'is_default = :is_default',
        ExpressionAttributeValues: {
            ':is_default': true
        },
        Limit: 1
    };
    const TemplateMaster = await docClient.scan(params).promise();
    const TemplateMasterData = TemplateMaster.Items;
    const Template = { ...TemplateMasterData[0] };
    params = {
        TableName: 'Portal_users',
        Select: 'SPECIFIC_ATTRIBUTES',
        AttributesToGet: ['user_id']
    };
    const PortalUsers = await docClient.scan(params).promise();
    const PortalUsersData = PortalUsers.Items;

    const templatesData = [];
    PortalUsersData.forEach(async (user) => {
        const templateData = { ...Template };
        templateData.brand_id = user.user_id;
        templateData.active = true;
        templatesData.push(templateData);
    });
    for (let i = 0; i < templatesData.length; i = i + 24) {
        const data = templatesData.slice(i, i + 24);
        await TemplateModel.batchPut(data);
    }
    return Utils.successResponse({}, Message.COMMON.INSERTED_SUCCESSFULLY);
};
