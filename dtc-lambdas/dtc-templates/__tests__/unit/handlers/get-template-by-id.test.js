var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-template-by-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
describe('Test getTemplateByIdHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    it('should get validation error', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                templateid: 'af169e51-d7e0-4bba-8aff-cadc0d4637a1'
            }
        };
        const result = await lambda.getTemplateByIdHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});