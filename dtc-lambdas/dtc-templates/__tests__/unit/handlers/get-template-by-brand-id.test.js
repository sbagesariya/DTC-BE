var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-template-by-brand-id');
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
        'title': 'Should able to get template by-brand',
        'data': {
            'brandid': 'a12801b4-51ef-48de-b3d9-047eec4dde51'
        },
        'status': 1
    },
    {
        'title': 'Should able to get template by-brand & template',
        'data': {
            'brandid': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'template_id': '51f462ba-decb-4970-84c4-73168004ac6'
        },
        'status': 1
    }
];
describe('Test getTemplateByBrandIdHandler', () => {
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
                httpMethod: 'GET',
                pathParameters: ele.data
            };
            // Invoke getProductsByBrandIdHandler()
            const result = await lambda.getTemplateByBrandIdHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});