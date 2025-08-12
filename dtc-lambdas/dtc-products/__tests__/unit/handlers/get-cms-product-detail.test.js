var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-cms-product-detail');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'product_id': ['4f2e9bba-a741-42fb-85c9-0f56c4c85d57']
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
        'title': 'Should able to get cms product details',
        'data': {
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'product_id': '70536ab0-f453-11eb-bce8-69e3310be935'
        },
        'status': 1
    }
];

describe('Test getCmsProductsDetailHandler', () => {
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
                pathParameters: ele.data
            };
            const result = await lambda.getCmsProductsDetailHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
