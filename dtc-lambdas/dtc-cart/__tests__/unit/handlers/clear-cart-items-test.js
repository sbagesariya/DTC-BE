var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/clear-cart-items');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'User not found',
        'data': {
            'userId': '12222233'
        },
        'status': 0
    },
    {
        'title': 'Should able to clear cart',
        'data': {
            'userId': '0ybt5w68h1'
        },
        'status': 1
    }
];
describe('Test clearCartHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'DELETE',
                pathParameters: ele.data
            };
            const result = await lambda.clearCartHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
