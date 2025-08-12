var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-products-by-brand');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8'
        },
        'status': 0
    },
    {
        'title': 'Retailer id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Should able to get products by brand',
        'data': {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }
];
describe('Test getProductsByBrandHandler', () => {
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
            const result = await lambda.getProductsByBrandHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).status).toBeDefined();
            });
        });
    });
});