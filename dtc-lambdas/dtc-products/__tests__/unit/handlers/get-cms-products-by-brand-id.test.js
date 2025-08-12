
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-cms-products-by-brand-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should get error brand id require',
        'data': {
            'universal_search': '',
            'limit': 16,
            'order': 'asc',
            'sort': 'product_name'
        },
        'status': 0
    },
    {
        'title': 'Should able to get cms products',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'universal_search': 'test',
            'limit': 16,
            'order': 'asc',
            'sort': 'product_name',
            'lastKey': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to get cms active products',
        'data': {
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'universal_search': 'product',
            'is_cms': true
        },
        'status': 0
    }
];

// This includes all tests for getCmsProductsByBrandIdHandler()
describe('Test getCmsProductsByBrandIdHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
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
            const result = await lambda.getCmsProductsByBrandIdHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
