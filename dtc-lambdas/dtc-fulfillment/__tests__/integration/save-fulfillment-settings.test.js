var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../src/handlers/save-fulfillment-settings');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'brand_id': '',
            'primary_address': {
                'zipcode': '90048',
                'lng': -118.3773546,
                'city': 'city-1',
                'address_line_1': 'first',
                'address_line_2': 'second',
                'state': 'Florida',
                'lat': 34.0751706
            },
            'primary_email_address': 'fulfillmentcenter@parkstreet.com',
            'shipping_zone_rates': [
                {
                    'name': 'zone-1',
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
                    'name': 'zone-2',
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
            ],
            'fulfillment_center_name': 'Parkstreet Import',
            'primary_contact_number': '1234567890',
            'is_fulfillment_center': true
        },
        'status': 0
    },
    {
        'title': 'Save new fullfillment center',
        'data': {
            'fulfillment_center_id': '',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'primary_address': {
                'zipcode': '90048',
                'lng': -118.3773546,
                'city': 'city-1',
                'address_line_1': 'first',
                'address_line_2': 'second',
                'state': 'Florida',
                'lat': 34.0751706
            },
            'primary_email_address': 'fulfillmentcenter@parkstreet.com',
            'shipping_zone_rates': [
                {
                    'name': 'zone-1',
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
                    'name': 'zone-2',
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
            ],
            'fulfillment_center_name': 'Parkstreet Import',
            'primary_contact_number': '1234567890',
            'is_fulfillment_center': true
        },
        'status': 1
    },
    {
        'title': 'Invalid primary_address data request object',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'primary_email_address': 'fulfillmentcenter@parkstreet.com',
            'shipping_zone_rates': [
                {
                    'name': 'zone-1',
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
                    'name': 'zone-2',
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
            ],
            'fulfillment_center_name': 'Parkstreet Import',
            'primary_contact_number': '1234567890',
            'is_fulfillment_center': true
        },
        'status': 0
    },
    {
        'title': 'Invalid fulfillment center ID test',
        'data': {
            'fulfillment_center_id': 'invalid Id',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'primary_address': {
                'zipcode': '90048',
                'lng': -118.3773546,
                'city': 'city-1',
                'address_line_1': 'first',
                'address_line_2': 'second',
                'state': 'Florida',
                'lat': 34.0751706
            },
            'primary_email_address': 'fulfillmentcenter@parkstreet.com',
            'shipping_zone_rates': [
                {
                    'name': 'zone-1',
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
                    'name': 'zone-2',
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
            ],
            'fulfillment_center_name': 'Parkstreet Import',
            'primary_contact_number': '1234567890',
            'is_fulfillment_center': true
        },
        'status': 1
    },
    {
        'title': 'Update fulfillment center details',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'primary_address': {
                'zipcode': '90048',
                'lng': -118.3773546,
                'city': 'city-1',
                'address_line_1': 'first',
                'address_line_2': 'second',
                'state': 'Florida',
                'lat': 34.0751706
            },
            'primary_email_address': 'fulfillmentcenter@parkstreet.com',
            'shipping_zone_rates': [
                {
                    'name': 'zone-1',
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
                    'name': 'zone-2',
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
            ],
            'fulfillment_center_name': 'Parkstreet Import',
            'primary_contact_number': '1234567890',
            'is_fulfillment_center': true
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
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.SaveFulfillmentSettingsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
