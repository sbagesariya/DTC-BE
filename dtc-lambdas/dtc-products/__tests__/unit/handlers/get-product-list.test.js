
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-product-list');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getProductListHandler', () => {
    let getSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get product list', async () => {
        const returnedItem = {};
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Item: returnedItem })
        });
        const event = {
            httpMethod: 'GET'
        };
        const result = await lambda.getProductListHandler(event);
        const expectedResult = {
            statusCode: 200,
            body: JSON.stringify(returnedItem)
        };
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
