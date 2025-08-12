var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/fulfillment-product-inventory');
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
        'title': 'Should able to get fulfillment product inventory',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'limit': 6,
            'page': 0,
            'universal_search': ''
        },
        'status': 1
    }
];
describe('Test fulfillmentProductInventoryHandler', () => {
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
            const result = await lambda.fulfillmentProductInventoryHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
