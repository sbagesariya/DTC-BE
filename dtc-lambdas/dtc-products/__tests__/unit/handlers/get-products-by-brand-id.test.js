var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-products-by-brand-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
process.env.BucketName = 'dtc-stg-public';
const mockData = [
    {
        'title': 'Should able to get products',
        'data': {
            'brandid': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'sort_by': 1
        },
        'status': 1
    },
    {
        'title': 'Should able to get products with type',
        'data': {
            'brandid': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'type': ['Wine'],
            'sort_by': 2,
            'size': ['100 ml']
        },
        'status': 1
    },
    {
        'title': 'Should able to get products with type',
        'data': {
            'brandid': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'sort_by': 4
        },
        'status': 1
    },
    {
        'title': 'Should able to get products with cms',
        'data': {
            'brandid': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'template_id': 'bc0c27ea-178e-419d-a0fa-fc0a18231697',
            'iscms': true
        },
        'status': 1
    },
    {
        'title': 'Should able to get retailer products',
        'data': {
            'brandid': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8'
        },
        'status': 1
    }
];

// This includes all tests for getProductsByBrandIdHandler()
describe('Test getProductsByBrandIdHandler', () => {
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
            // Invoke getProductsByBrandIdHandler()
            const result = await lambda.getProductsByBrandIdHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
