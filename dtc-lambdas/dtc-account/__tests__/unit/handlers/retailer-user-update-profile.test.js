var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/retailer-user-update-profile');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'password': 'test123',
            'new_password': 'test124',
            'confirm_password': 'test124'
        },
        'status': 0
    },
    {
        'title': 'New password is required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test123',
            'confirm_password': 'test124'
        },
        'status': 0
    },
    {
        'title': 'Confirm password is required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test123',
            'new_password': 'test124'
        },
        'status': 0
    },
    {
        'title': 'Password and Confirm Password does not match',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test123',
            'new_password': 'test124',
            'confirm_password': 'test1245'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'email': 'aderrickh_retailer1234@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test123',
            'new_password': 'test124',
            'confirm_password': 'test124'
        },
        'status': 0
    },
    {
        'title': 'Wrong password',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test1245',
            'new_password': 'test1',
            'confirm_password': 'test1'
        },
        'status': 0
    },
    {
        'title': 'Should able to user update the password',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'password': 'test123',
            'new_password': 'test124',
            'confirm_password': 'test124'
        },
        'status': 1
    },
    {
        'title': 'Name is required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            }
        },
        'status': 0
    },
    {
        'title': 'Phone is required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            }
        },
        'status': 0
    },
    {
        'title': 'Primary address is required',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789'
        },
        'status': 0
    },
    {
        'title': 'Should able to user update profile',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'addresses': [
                {
                    'address_line_1': 'first',
                    'address_line_2': 'second',
                    'city': 'city-1',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                },
                {
                    'address_line_1': 'third',
                    'address_line_2': 'fourth',
                    'city': 'city-2',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '12345',
                    'lat': '133432435435',
                    'long': '-143243242424'
                }
            ]
        },
        'status': 1
    },
    {
        'title': 'Should able to user edit profile',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'addresses': [
                {
                    'address_id': '3447bc10-d40a-11eb-8867-557757896e11',
                    'address_line_1': 'first',
                    'address_line_2': 'second',
                    'city': 'city-1',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                },
                {
                    'address_id': '34d751e0-d40a-11eb-aba7-1fb218af4226',
                    'address_line_1': 'third',
                    'address_line_2': 'fourth',
                    'city': 'city-2',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '12345',
                    'lat': '133432435435',
                    'long': '-143243242424'
                }
            ]
        },
        'status': 1
    },
    {
        'title': 'Should able to user update profile for second user',
        'data': {
            'email': 'cgaither8_retailer@businessweek.com',
            'first_name': 'Total',
            'last_name': 'Wine',
            'phone': '123456789',
            'primary_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'state': 'Florida',
                'country': 'US',
                'zip_code': '456456',
                'lat': '12345',
                'long': '-12333334'
            },
            'addresses': [
                {
                    'address_line_1': 'first',
                    'address_line_2': 'second',
                    'city': 'city-1',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '456456',
                    'lat': '12345',
                    'long': '-12333334'
                },
                {
                    'address_line_1': 'third',
                    'address_line_2': 'fourth',
                    'city': 'city-2',
                    'state': 'Florida',
                    'country': 'US',
                    'zip_code': '12345',
                    'lat': '133432435435',
                    'long': '-143243242424'
                }
            ]
        },
        'status': 1
    }
];
describe('Test RetailerUserUpdateProfileHandler', () => {
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
            const result = await lambda.RetailerUserUpdateProfileHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
