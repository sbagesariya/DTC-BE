var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-order-status');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test GetOrderStatusHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    it('should get orders', async () => {
        const event = {
            httpMethod: 'GET'
        };
        const result = await lambda.getOrderStatusHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});
