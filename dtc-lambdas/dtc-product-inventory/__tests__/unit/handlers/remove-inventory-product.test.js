var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/remove-inventory-product');
const dynamodb = require('aws-sdk/clients/dynamodb');
function callbackFunction (err, result) {
    expect((JSON.parse(result.body)).status).toBeDefined();
}

const mockData = [
    {
        'title': 'Invalid request',
        'data': {
            'createdAt': 1619691420674
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        'data': {
            'retailerId': '04b6a7b0-e430-4492-b8dd-6cac04cee405'
        },
        'status': 0
    },
    {
        'title': 'No record found',
        'data': {
            'retailerId': '04b6a7b0-e430-4492-b8dd-6cac04cee12',
            'createdAt': 1619691420674
        },
        'status': 0
    },
    {
        'title': 'Should able to remove Inventory product',
        'data': {
            'retailerId': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'createdAt': '1619691420674'
        },
        'status': 1
    }
];
describe('Test removeInventoryProductHandler', () => {
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
            const result = await lambda.removeInventoryProductHandler(event, {}, callbackFunction);
        });
    });
});
