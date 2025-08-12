var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-saved-template');
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
        'title': 'Should able to get Saved Template',
        'data': {
            'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51'
        },
        'status': 1
    }
];
describe('Test getSavedTemplateHandler', () => {
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
                pathParameters: ele.data
            };
            // Invoke getProductsByBrandIdHandler()
            const result = await lambda.getSavedTemplateHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
