const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('./../../src/handlers/check-sub-domain-availibility');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Domain name is required',
        'data': {
            'domain_name': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to check sub domain availibility',
        'data': {
            'domain_name': 'stgdtc.parkstreet.com'
        },
        'status': 1
    }
];
describe('Test checkSubDomainAvailibilityHandler', () => {
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
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.checkSubDomainAvailibilityHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
