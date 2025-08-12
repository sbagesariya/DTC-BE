var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-cart-items');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'brand_name': 'Adami',
            'user_id': '0ybt5w68h1',
            'delivery_address': {
                'address_line_1': 'Southwest 1st Street',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'zip_code': '33135',
                'country': 'US'
            },
            'state': 'Florida'
        },
        'status': 0
    },
    {
        'title': 'Brand name is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'user_id': '0ybt5w68h1',
            'delivery_address': {
                'address_line_1': 'Southwest 1st Street',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'zip_code': '33135',
                'country': 'US'
            },
            'state': 'Florida'
        },
        'status': 0
    },
    {
        'title': 'User Id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': 'Southwest 1st Street',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'zip_code': '33135',
                'country': 'US'
            },
            'state': 'Florida'
        },
        'status': 0
    },
    {
        'title': 'State is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'user_id': '0ybt5w68h1',
            'delivery_address': {
                'address_line_1': 'Southwest 1st Street',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'zip_code': '33135',
                'country': 'US'
            }
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'user_id': '0ybt5w68h1'
        },
        'status': 0
    },
    {
        'title': 'Should able to get cart item',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'user_id': '0ybt5w68h1',
            'delivery_address': {
                'address_line_1': 'Southwest 1st Street',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'zip_code': '33135',
                'country': 'US'
            },
            'state': 'Florida'
        },
        'status': 1
    }
];
describe('Test getCartItemsHandler', () => {
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
            const result = await lambda.getCartItemsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
