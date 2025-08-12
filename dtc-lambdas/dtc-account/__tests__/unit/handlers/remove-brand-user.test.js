var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/remove-brand-user');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'User Id is required',
        'data': {
            'user_id': ''
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'user_id': '1ccbb4d2-a048-40fc-8381'
        },
        'status': 0
    },
    {
        'title': 'Should able to remove-brand-user',
        'data': {
            'user_id': '32c1d2de-6221-4a16-b16f-9cdc57fe47bb'
        },
        'status': 0
    }
];
// This includes all tests for RemoveBrandUserHandler()
describe('Test RemoveBrandUserHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'DELETE',
                pathParameters: ele.data
            };
            const result = await lambda.RemoveBrandUserHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
