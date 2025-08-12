var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-brand-template-library.js');
// Import dynamodb from aws-sdk
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for getTemplateByBrandIdHandler()
describe('Test getTemplateByBrandIdHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });

    // Clean up mocks
    afterAll(() => {
        getSpy.mockRestore();
    });

    // This test invokes getTemplateByBrandIdHandler() and compare the result
    it('Required brand id', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                brand_id: ''
            }
        };
        // Invoke getTemplateByBrandIdHandler()
        const result = await lambda.getBrandTemplateLibraryHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(0);
    });

    // This test invokes getTemplateByBrandIdHandler() and compare the result
    it('Invalid brand id', async () => {
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                brand_id: '9b9af5d1-d518-4441-9c98-9a477241ab12'
            }
        };
        // Invoke getTemplateByBrandIdHandler()
        const result = await lambda.getBrandTemplateLibraryHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(0);
    });

    // This test invokes getTemplateByBrandIdHandler() and compare the result
    it('Should get template libraries', async () => {
        const item = { brand_id: 'id1' };
        // Return the specified value whenever the spied get function is called
        getSpy.mockReturnValue({
            promise: () => Promise.resolve({ Item: item })
        });
        const event = {
            httpMethod: 'GET',
            pathParameters: {
                brand_id: '9b9af5d1-d518-4441-9c98-9a477241ab91'
            }
        };
        // Invoke getTemplateByBrandIdHandler()
        const result = await lambda.getBrandTemplateLibraryHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});
