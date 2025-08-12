
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-brand-users');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test GetBrandUsersHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get brand user list', async () => {
        const event = {
            httpMethod: 'GET'
        };
        const result = await lambda.GetBrandUsersHandler(event);
        const expectedResult = {
            statusCode: 200
        };
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
