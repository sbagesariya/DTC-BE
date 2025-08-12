
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-variant-by-product-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Product Id is required',
        'data': {
            'limit': 5,
            'order': 'asc',
            'sort': 'variant_size'
        },
        'status': 0
    },
    {
        'title': 'Should able to get variants',
        'data': {
            'product_id': '07be0c5c-a576-4fb1-bd02-9b45f81dfcf0',
            'limit': 5,
            'order': 'asc',
            'sort': 'variant_size'
        },
        'status': 0
    }
];

// This includes all tests for getVariantByProductIdHandler()
describe('Test getVariantByProductIdHandler', () => {
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
                'product_id': '07be0c5c-a576-4fb1-bd02-9b45f81dfcf0',
                'limit': 5,
                'order': 'asc',
                'sort': 'variant_size'
            };

            // Return the specified value whenever the spied put function is called
            putSpy.mockReturnValue({
                promise: () => Promise.resolve(returnedItem)
            });

            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };

            // Invoke getVariantByProductIdHandler()
            const result = await lambda.getVariantByProductIdHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
