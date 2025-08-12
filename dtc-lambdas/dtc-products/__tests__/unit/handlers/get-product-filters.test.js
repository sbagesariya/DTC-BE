
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-product-filters');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getProductFiltersHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get product filters', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: { brandid: '1473b1ee-b165-4691-9a25-bfe243430191' }
        };
        const result = await lambda.getProductFiltersHandler(event);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(result)
        };
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
