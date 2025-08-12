
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/delete-product-variants');
const AddVariant = require('../../../src/handlers/add-variant');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Invalid data',
        'status': 0
    },
    {
        'title': 'Invalid data',
        'data': [],
        'status': 0
    },
    {
        'title': 'Invalid data',
        'data': [
            {
                'product_id': 'c7d4fbd0-8d7b-11eb-8204-413141717af6'
            }
        ],
        'status': 0
    },
    {
        'title': 'Delete product variants',
        'data': [
            {
                'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
                'variant_id': '6cdd77f5-8afa-4f69-ab46-6753eaec8412'
            }
        ],
        'status': 1
    },
    {
        'add': true,
        'title': 'Add product variants',
        'data': [
            {
                'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
                'variant_id': '6cdd77f5-8afa-4f69-ab46-6753eaec8412',
                'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
                'sku_code': 121,
                'upc_code': 7888,
                'variant_size': 12,
                'variant_type': 'ml'
            }
        ],
        'status': 1
    }
];

// This includes all tests for addVariantHandler()
describe('Test addVariantHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'DELETE');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        if (ele.add) {
            it(ele.title, async () => {
                const event = {
                    httpMethod: 'POST',
                    body: JSON.stringify(ele.data)
                };
                const result = await lambda.addVariantHandler(event);
                expect((JSON.parse(result.body)).status).toEqual(ele.status);
            });
        } else {
            it(ele.title, async () => {
                const event = {
                    httpMethod: 'DELETE',
                    body: JSON.stringify(ele.data)
                };
                const result = await lambda.DeleteProductVariantsHandler(event);
                expect((JSON.parse(result.body)).status).toEqual(ele.status);
            });
        }
    });
});
