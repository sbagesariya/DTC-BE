var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/portal-user-signIn');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'password': 'test123',
            'user_type': 'retailer'
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'email': 'dcleverley0',
            'password': 'test123',
            'user_type': 'brand'
        },
        'status': 0
    },
    {
        'title': 'User type is required',
        'data': {
            'email': 'dcleverley0@wunderground.com',
            'password': 'test123'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'email': 'dcleverley121212120@wunderground.com',
            'password': 'test123',
            'user_type': 'brand'
        },
        'status': 0
    },
    {
        'title': 'Invalid user type',
        'data': {
            'email': 'dcleverley0@wunderground.com',
            'password': 'test123',
            'user_type': 'brand1'
        },
        'status': 0
    },
    {
        'title': 'Should able to signin',
        'data': {
            'email': 'dcleverley0@wunderground.com',
            'password': 'test123',
            'user_type': 'brand'
        },
        'status': 1
    },
    {
        'title': 'Should able to signin with retailer',
        'data': {
            'email': 'aderrickh_retailer@mozilla.com',
            'password': 'test123',
            'user_type': 'retailer'
        },
        'status': 1
    }
];
describe('Test PortalUserSignInHandler', () => {
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
            const result = await lambda.PortalUserSignInHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
