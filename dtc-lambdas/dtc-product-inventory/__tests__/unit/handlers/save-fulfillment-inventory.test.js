var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/save-fulfillment-inventory');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'CreatedAt is required',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'alcohol_type': 'Wine',
            'size': '150 ml',
            'stock': 12,
            'product_name': 'Product-165',
            'sku_code': 1990,
            'unit_price_per_market': [
                {
                    'rate': 125,
                    'states': [
                        {
                            'name': 'Alabama',
                            'id': '2'
                        },
                        {
                            'name': 'Delaware',
                            'id': '9'
                        }
                    ]
                },
                {
                    'rate': 200,
                    'states': [
                        {
                            'name': 'Colorado',
                            'id': '6'
                        },
                        {
                            'name': 'Connecticut',
                            'id': '7'
                        }
                    ]
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Fulfillment center Id is required',
        'data': {
            'createdAt': 1634108963219,
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'alcohol_type': 'Wine',
            'size': '150 ml',
            'stock': 12,
            'product_name': 'Product-165',
            'sku_code': 1990,
            'unit_price_per_market': [
                {
                    'rate': 125,
                    'states': [
                        {
                            'name': 'Alabama',
                            'id': '2'
                        },
                        {
                            'name': 'Delaware',
                            'id': '9'
                        }
                    ]
                },
                {
                    'rate': 200,
                    'states': [
                        {
                            'name': 'Colorado',
                            'id': '6'
                        },
                        {
                            'name': 'Connecticut',
                            'id': '7'
                        }
                    ]
                }
            ]
        },
        'status': 0
    }, {
        'title': 'No record found!',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5',
            'createdAt': 16341089639,
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'alcohol_type': 'Wine',
            'size': '150 ml',
            'stock': 12,
            'product_name': 'Product-165',
            'sku_code': 1990,
            'unit_price_per_market': [
                {
                    'rate': 125,
                    'states': [
                        {
                            'name': 'Alabama',
                            'id': '2'
                        },
                        {
                            'name': 'Delaware',
                            'id': '9'
                        }
                    ]
                },
                {
                    'rate': 200,
                    'states': [
                        {
                            'name': 'Colorado',
                            'id': '6'
                        },
                        {
                            'name': 'Connecticut',
                            'id': '7'
                        }
                    ]
                }
            ]
        },
        'status': 0
    }, {
        'title': 'Save Fulfillment center product inventory details',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'createdAt': 1634108963219,
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'alcohol_type': 'Wine',
            'size': '150 ml',
            'stock': 12,
            'product_name': 'Product-165',
            'sku_code': 1990,
            'unit_price_per_market': [
                {
                    'rate': 125,
                    'states': [
                        {
                            'name': 'Alabama',
                            'id': '2'
                        },
                        {
                            'name': 'Delaware',
                            'id': '9'
                        }
                    ]
                },
                {
                    'rate': 200,
                    'states': [
                        {
                            'name': 'Colorado',
                            'id': '6'
                        },
                        {
                            'name': 'Connecticut',
                            'id': '7'
                        }
                    ]
                }
            ]
        },
        'status': 1
    }
];
describe('Test saveFulfillmentInventoryHandler', () => {
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
            const result = await lambda.saveFulfillmentInventoryHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
