const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-user-menu-items');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'User id is required',
        'data': {
            'email': 'dcleverley0@wunderground.com'
        },
        'status': 0
    },
    {
        'title': 'Email is required',
        'data': {
            'user_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'user_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'email': 'dcleverley0123456774@wunderground.com'
        },
        'status': 0
    },
    {
        'title': 'Menu permission not found',
        'data': {
            'user_id': 'ca28ebe2-ca25-42da-95ba-3164a2a4efd3',
            'email': 'mpatel@parkstreet.com'
        },
        'status': 0
    },
    {
        'title': 'Should able to user menu items',
        'data': {
            'user_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'email': 'dcleverley0@wunderground.com'
        },
        'status': 1
    },
    {
        'title': 'Should able to user menu items',
        'data': {
            'user_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'email': 'dcleverley0_retailer@wunderground.com'
        },
        'status': 1
    },
    {
        'title': 'Should able to user profile menu items',
        'data': {
            'user_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'email': 'aderrickh_retailer1234@mozilla.com'
        },
        'status': 0
    }
];
describe('Test getUserMenuItemsHandler', () => {
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
            const result = await lambda.getUserMenuItemsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
