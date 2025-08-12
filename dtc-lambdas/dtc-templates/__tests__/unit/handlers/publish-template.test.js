var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/publish-template');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5'
        },
        'status': 0
    },
    {
        'title': 'Template Id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'No Data found',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5'
        },
        'status': 0
    },
    {
        'title': 'Should able to get Publish Template 5',
        'data': {
            'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];
function callbackFunction (err, result) {
    expect((JSON.parse(result.body)).status).toBeDefined();
}
describe('Test PublishTemplateHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            // Invoke PublishTemplateHandler()
            await lambda.PublishTemplateHandler(event, {}, callbackFunction);
        });

    });
});