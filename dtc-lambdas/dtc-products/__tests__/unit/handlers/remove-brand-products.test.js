var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/remove-brand-products');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'product_ids': ['099540ed-9cbd-45ed-9b5f-9e527918aab2']
        },
        'status': 0
    },
    {
        'title': 'Product Id is required',
        'data': {
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Should able to remove-brand-products',
        'data': {
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'product_ids': ['0a6fea42-8955-4fbc-94e6-6384034f4ac6']
        },
        'status': 0
    }
];
// This includes all tests for RemoveBrandProductsHandler()
describe('Test RemoveBrandProductsHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.PRODUCTS_TABLE = 'Products';
            process.env.SAVED_PRODUCTS_TABLE = 'Saved_products';
            process.env.SIZE_VARIANTS_TABLE = 'Size_variants';
            process.env.PRODUCTS_ADDRESSES_TABLE = 'Products_addresses';
            process.env.CART_TABLE = 'Cart';
            process.env.INVENTORY_TABLE = 'Inventory';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.RemoveBrandProductsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
