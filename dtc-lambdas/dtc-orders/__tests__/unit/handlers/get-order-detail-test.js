var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-order-detail');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Order id is require',
        'data': {
            'order_id': ''
        },
        'resource': 'cms/',
        'status': 0
    },
    {
        'title': 'Should able to get order details',
        'data': {
            'order_id': '069998-43585'
        },
        'resource': 'cms/',
        'status': 1
    }
];
describe('Test getOrderDetailHandler', () => {
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
                pathParameters: ele.data,
                resource: ele.resource
            };
            const result = await lambda.getOrderDetailHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});