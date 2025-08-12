var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-all-templates.js');
const dynamodb = require('aws-sdk/clients/dynamodb');
describe('Test getAllTemplatesHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get all Templates', async () => {
        const item = {};
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Item: item })
        });
        const event = {
            httpMethod: 'GET'
        };
        const result = await lambda.getAllTemplatesHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});
