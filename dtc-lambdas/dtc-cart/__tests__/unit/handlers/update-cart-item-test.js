var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/update-cart-item');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should able to get cart item',
        'data': {
            'userid': '08e4f5b5-47f6-4a74-b3a0-b90886813c2d',
            'cartid': '6e29eaa0-44f1-11eb-9036-67bb21b090612',
            'qty': '5'
        },
        'status': 1
    }
];
describe('Test updateCartItemHandler', () => {
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
                httpMethod: 'PUT',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.updateCartItemHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
