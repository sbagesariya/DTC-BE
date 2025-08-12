var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-recipes-by-brand-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Get unpublish records',
        'data': {
            'brandid': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'published': 'false'
        },
        'status': 1
    },
    {
        'title': 'Get publish records',
        'data': {
            'brandid': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'published': 'true'
        },
        'status': 1
    }
];
describe('Test getRecipesByBrandIdHandler', () => {
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
            const result = await lambda.getRecipesByBrandIdHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
