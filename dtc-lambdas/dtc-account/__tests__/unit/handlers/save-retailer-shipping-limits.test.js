var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/save-retailer-shipping-limits');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'shipping_limits': {}
        },
        'status': 0
    },
    {
        'title': 'Shipping limits required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'email': 'aderrickh_retailer1234@mozilla.com',
            'shipping_limits': {}
        },
        'status': 0
    },
    {
        'title': 'Should able to save retailer shipping limit',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'shipping_limits': [
                {
                    'state': 'Florida',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                },
                {
                    'state': 'Florida',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                }
            ]
        },
        'status': 1
    },
    {
        'title': 'Should able to update retailer shipping limit',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'shipping_limits': [
                {
                    'address_id': '970455f0-d281-11eb-a56a-7b57a37459be',
                    'state': 'Florida',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                }
            ]
        },
        'status': 1
    }
];
describe('Test SaveRetailerShippingLimitsHandler', () => {
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
            const result = await lambda.SaveRetailerShippingLimitsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
