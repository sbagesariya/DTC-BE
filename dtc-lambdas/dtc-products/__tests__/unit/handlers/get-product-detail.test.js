var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-product-detail');
const dynamodb = require('aws-sdk/clients/dynamodb');

describe('Test getProductsDetailHandler', () => {

    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    it('should get product detail', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(
                {
                    brandid: '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
                    productid: '8ff03895-c71c-450b-a65b-9d22db1bb1b3' // 0a6fea42-8955-4fbc-94e6-6384034f4ac6
                }
            )
        };
        const result = await lambda.getProductsDetailHandler(event);
        const expectedResult = {
            statusCode: 200
        };
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
    it('should get product detail with cms', async () => {
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(
                {
                    brandid: '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
                    productid: '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
                    template_id: '51f462ba-decb-4970-84c4-73168004ac63',
                    iscms: 'true'
                }
            )
        };
        const result = await lambda.getProductsDetailHandler(event);
        const expectedResult = {
            statusCode: 200
        };
        expect(result.statusCode).toEqual(expectedResult.statusCode);
    });
});
