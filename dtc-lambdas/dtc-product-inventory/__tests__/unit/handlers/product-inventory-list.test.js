var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/product-inventory-list');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should validate and error list product inventory',
        'data': {
            'universal_search': '',
            'order': 'asc',
            'sort': 'retailer_product_id',
            'limit': 6,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8'
        },
        'status': 0
    },
    {
        'title': 'Retailer id is required',
        'data': {
            'universal_search': '',
            'order': 'asc',
            'sort': 'retailer_product_id',
            'limit': 6
        },
        'status': 0
    },
    {
        'title': 'Should list product inventory',
        'data': {
            'universal_search': '',
            'order': 'asc',
            'sort': 'retailer_product_id',
            'limit': 6,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8'
        },
        'status': 0
    }
];
describe('Test productInventoryListHandler', () => {
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
            const result = await lambda.productInventoryListHandler(event, {}, ()=>{});
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});