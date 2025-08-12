
const AWS = require('aws-sdk');
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-orders');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should able to get order by id',
        'data': {
            'order_id': '490248-FF65B'
        },
        'status': 1
    },
    {
        'title': 'Should able to get order by email',
        'data': {
            'user_email': 'jt@test.com'
        },
        'status': 1
    }
];

describe('Test GetOrdersHandler', () => {
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
            const result = await lambda.GetOrdersHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
