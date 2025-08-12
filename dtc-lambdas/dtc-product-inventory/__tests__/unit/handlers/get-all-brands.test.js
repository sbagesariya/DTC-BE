var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-all-brands');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should able to get all brand',
        'data': {
            'search_brand': ''
        },
        'status': 1
    },
    {
        'title': 'Should able to get specific brand',
        'data': {
            'search_brand': 'brand-8'
        },
        'status': 1
    }
];
describe('Test getAllBrandsHandler', () => {
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
            const result = await lambda.getAllBrandsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
