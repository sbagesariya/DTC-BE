var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../src/handlers/save-fulfillment-preference');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'brand_id': '',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'product',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': [{
                'id': 1,
                'name': 'market-name'
            }]
        },
        'status': 0
    },
    {
        'title': 'Brand not found!',
        'data': {
            'brand_id': 'NotfoundBrand',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'product',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': [{
                'id': 1,
                'name': 'market-name'
            }]
        },
        'status': 0
    },
    {
        'title': 'Invalid markets data request object',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'markets':  'sdf',
            'fulfillment_options': 'product',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': [{
                'id': 1,
                'name': 'market-name'
            }]
        },
        'status': 0
    },
    {
        'title': 'Invalid fulfillment_options data request object',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'sdfdf',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': [{
                'id': 1,
                'name': 'market-name'
            }]
        },
        'status': 0
    }, {
        'title': 'Invalid retail_network data request object',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'sdfdf',
            'fulfillment_center': [{
                'id': 1,
                'name': 'market-name'
            }]
        },
        'status': 1
    }, {
        'title': 'Invalid fulfillment_center data request object',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'sdfdf',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': {
                'id': 1,
                'name': 'market-name'
            }
        },
        'status': 1
    }, {
        'title': 'Should able save fullfillment perference',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'markets':  [{
                'id': '2',
                'name': 'Alabama'
            }, {
                'id': '1',
                'name': 'Alaska'
            }, {
                'id': '101',
                'name': 'American Samoa'
            }, {
                'id': '4',
                'name': 'Arizona'
            }],
            'fulfillment_options': 'market',
            'retail_network': [{
                'id': 1,
                'name': 'market-name'
            }],
            'fulfillment_center': [{
                'id': 1,
                'name': 'Spirit'
            }]
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
            const result = await lambda.SaveFulfillmentPreferenceHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
