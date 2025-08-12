var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/add-product-inventory');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Invalid request checking must request in array',
        'data': {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c9',
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'product_id': '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
            'brand_name': 'Brand-1',
            'product_name': 'Product-14',
            'variant_size': '400 ml',
            'upc_code': 1234567800,
            'stock': 50,
            'alcohol_type': 'Wine',
            'unit_price': 200,
            'createdAt': 1619691420674
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        'data': [{
            'product_id': '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
            'brand_name': 'Brand-1',
            'product_name': 'Product-14',
            'variant_size': '400 ml',
            'upc_code': 1234567800,
            'stock': 50,
            'alcohol_type': 'Wine',
            'unit_price': 200,
            'createdAt': 1619691420674
        }],
        'status': 0
    },
    {
        'title': 'Should able to add inventory product',
        'data': [{
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '07ca3eb0-8e1e-11eb-a30f-874abf28d510',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'brand_name': 'Brand-1',
            'product_name': 'Product-14',
            'variant_size': '400 ml',
            'upc_code': 1234567800,
            'stock': 50,
            'alcohol_type': 'Wine',
            'unit_price': 200,
            'createdAt': 1619691420674
        }],
        'status': 1
    }
];
describe('Test AddProductInventoryHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.AddProductInventoryHandler(event, {}, ()=> {});
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
