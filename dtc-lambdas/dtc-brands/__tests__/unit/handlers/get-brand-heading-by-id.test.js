var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-brand-heading-by-id');
const dynamodb = require('aws-sdk/clients/dynamodb');
describe('Test getBrandHeadingByIdHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });

    afterAll(() => {
        getSpy.mockRestore();
    });

    it('should get brand Heading By Id', async () => {
        const item = {};
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Item: item })
        });
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                brand_id: '2d9f9b7d-51a7-494a-936d-239ef47a7169'
            }
        };
        const result = await lambda.getBrandHeadingByIdHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});
