var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-order-summary-card');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'brand_id': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to get order Summary Card',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];
describe('Test getOrderSummaryCardHandler', () => {
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
            const result = await lambda.getOrderSummaryCardHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
