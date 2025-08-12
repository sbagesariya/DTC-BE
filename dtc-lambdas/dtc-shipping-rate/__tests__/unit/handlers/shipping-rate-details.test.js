var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/shipping-rate-details');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should not able to get shippig rate detail of a retailer',
        'data': {
            'retailer_id': '1b3209d1-0e86-474e-9aa2-invalid_id'
        },
        'status': 1
    },
    {
        'title': 'Should able to get shippig rate detail of a retailer',
        'data': {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8'
        },
        'status': 1
    }
];

describe('Test getShippingRateDetailsHandler', () => {
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
            const result = await lambda.ShippingRateDetailsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
