var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
db.aws.ddb.local('http://localhost:8000');

const lambda = require('../../../src/handlers/portal-user-forgot-password');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'email': ''
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'email': 'arathod123'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'email': 'arathod1232@parkstreet.com'
        },
        'status': 0
    },
    {
        'title': 'Should able to user forgot the password',
        'data': {
            'email': 'arathod@parkstreet.com'
        },
        'status': 0
    }
];
describe('Test PortalUserForgotPasswordHandler', () => {
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
            const result = await lambda.PortalUserForgotPasswordHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
