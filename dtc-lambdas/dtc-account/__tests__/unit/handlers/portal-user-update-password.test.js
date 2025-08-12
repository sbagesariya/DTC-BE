var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/portal-user-update-password');
const dynamodb = require('aws-sdk/clients/dynamodb');
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
db.aws.ddb.local('http://localhost:8000');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'password': 'test123'
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'email': 'arathod123',
            'password': 'test123'
        },
        'status': 0
    },
    {
        'title': 'User password is required',
        'data': {
            'email': 'arathod@parkstreet.com'
        },
        'status': 0
    },
    {
        'title': 'User Not found',
        'data': {
            'email': 'arathod1112@abc.com',
            'password': 'test123'
        },
        'status': 1
    },
    {
        'title': 'Should able to user update the password',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test1234'
        },
        'status': 1
    }
];
describe('Test PortalUserUpdatePasswordHandler', () => {
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
            const result = await lambda.PortalUserUpdatePasswordHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});