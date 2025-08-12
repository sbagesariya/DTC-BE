var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('./../../src/handlers/add-product-and-market-req');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'user_name': 'shivram bagesariya',
            'brand_name': 'Brand-3',
            'req_type': 'Products',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'user_email': 'dclearv',
            'user_name': 'shivram bagesariya',
            'brand_name': 'Brand-3',
            'req_type': 'Products',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Brand name is required',
        'data': {
            'user_email': 'sbagesariya@parkstreet.com',
            'user_name': 'shivram bagesariya',
            'brand_name': '',
            'req_type': 'Products',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Brand id is required',
        'data': {
            'user_email': 'sbagesariya@parkstreet.com',
            'user_name': 'shivram bagesariya',
            'brand_name': 'Brand-3',
            'req_type': 'Products'
        },
        'status': 0
    },
    {
        'title': 'Request type is required',
        'data': {
            'user_email': 'sbagesariya@parkstreet.com',
            'user_name': 'shivram bagesariya',
            'brand_name': 'Brand-3',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'User name is required',
        'data': {
            'user_email': 'sbagesariya@parkstreet.com',
            'brand_name': 'Brand-3',
            'req_type': 'Products',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Should able to user create account',
        'data': {
            'user_email': 'sbagesariya@parkstreet.com',
            'user_name': 'shivram bagesariya',
            'brand_name': 'Brand-3',
            'req_type': 'Products',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];
describe('Test AddProductAndMarket', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.JWT_SECRET = 'parkstreet007dtc';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.AddProductAndMarketReqHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
