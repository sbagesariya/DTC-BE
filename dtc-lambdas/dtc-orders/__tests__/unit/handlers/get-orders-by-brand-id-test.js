var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-orders-by-brand-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Retailer id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'user_type': 'retailer'
        },
        'status': 0
    },
    {
        'title': 'Brand id is required',
        'data': {
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69'
        },
        'status': 0
    },
    {
        'title': 'Should able to get order by brand',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'user_type': 'brand'
        },
        'status': 0
    },
    {
        'title': 'Should able to get order by brand with search',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'user_type': 'brand',
            'universal_search': 'retailer',
            'limit': 10,
            'order': 'asc',
            'sort': 'sort_total'
        },
        'status': 0
    },
    {
        'title': 'Should able to get order by retailer',
        'data': {
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'user_type': 'retailer',
            'universal_search': '',
            'limit': 10,
            'order': 'asc',
            'sort': 'sort_total',
            'status': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to get order by retailer with search',
        'data': {
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'user_type': 'retailer',
            'universal_search': 'johanan',
            'limit': 10,
            'order': 'asc',
            'sort': 'sort_total',
            'status': 'confirmed'
        },
        'status': 0
    }
];
describe('Test getOrdersByBrandHandler', () => {
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
            await lambda.getOrdersByBrandHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).status).toBeDefined();
            });
        });
    });
});
