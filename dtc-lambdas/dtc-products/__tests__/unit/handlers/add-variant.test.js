
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/add-variant');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'product_id': '78341190-9133-11eb-859b-5f64dc54d5d2',
            'variant_size': 100,
            'variant_type': 'ml',
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'Product Id is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'variant_size': 100,
            'variant_type': 'ml',
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'Size is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'product_id': '78341190-9133-11eb-859b-5f64dc54d5d2',
            'variant_size': 100,
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'Variant is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'product_id': '04b6a7b0-e430-4492-b8dd-6cac04cee409',
            'variant_type': 'ml',
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'UPC is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'product_id': '04b6a7b0-e430-4492-b8dd-6cac04cee409',
            'variant_size': 100,
            'variant_type': 'ml',
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'SKU code is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '53664d82-6185-49e3-8f75-d6b9fb495126',
            'variant_size': 100,
            'variant_type': 'ml',
            'upc_code': 1234567800
        },
        'status': 0
    },
    {
        'title': 'Should able to add variant',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '53664d82-6185-49e3-8f75-d6b9fb495126',
            'variant_size': 100,
            'variant_type': 'ml',
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    },
    {
        'title': 'No Data found',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '78341190-9133-11eb-859b-5f64dc54d5d2',
            'variant_size': 100,
            'variant_type': 'ml',
            'upc_code': 1234567800,
            'sku_code': 121
        },
        'status': 0
    }
];

// This includes all tests for addVariantHandler()
describe('Test addVariantHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const returnedItem = {
                'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
                'product_id': '04b6a7b0-e430-4492-b8dd-6cac04cee409',
                'variant_size': 100,
                'variant_type': 'ml',
                'upc_code': 1234567800,
                'sku_code': 121
            };

            // Return the specified value whenever the spied put function is called
            putSpy.mockReturnValue({
                promise: () => Promise.resolve(returnedItem)
            });

            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            // Invoke putItemHandler()
            const result = await lambda.addVariantHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
    // This test invokes putItemHandler() and compare the result
});
