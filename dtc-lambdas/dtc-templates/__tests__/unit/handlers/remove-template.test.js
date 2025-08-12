var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/remove-template');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1'
        },
        'status': 0
    },
    {
        'title': 'Template Id is required',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51'
        },
        'status': 0
    },
    {
        'title': 'Should able to remove-template',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'template_id': '51f462ba-decb-4970-84c4-73168004ac6'
        },
        'status': 1
    }
];
// This includes all tests for removeTemplateHandler()
describe('Test removeTemplateHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'POST',
                queryStringParameters: ele.data
            };
            const result = await lambda.removeTemplateHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});