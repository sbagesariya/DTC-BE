var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/product-inventory-detail');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Retailer id is required',
        'data': {
            'created_at': 1619784444752
        },
        'status': 0
    },
    {
        'title': 'Created at is required',
        'data': {
            'retailer_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
        },
        'status': 0
    },
    {
        'title': 'Should able to get Inventory Details',
        'data': {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'created_at': 1619691420674
        },
        'status': 1
    }
];
describe('Test ProductInventoryDetailHandler', () => {
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
            const result = await lambda.ProductInventoryDetailHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});