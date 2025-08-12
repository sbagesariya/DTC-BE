const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('./../../src/handlers/get-all-brand-domains');
const dynamodb = require('aws-sdk/clients/dynamodb');
const amplify = new AWS.Amplify();
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'brand_id': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to get all brand domain',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }
];
describe('Test getAllBrandDomainsHandler', () => {
    let getSpy;
    let amplifySpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
        amplifySpy = jest.spyOn(amplify, 'getDomainAssociation');
    });
    afterAll(() => {
        getSpy.mockRestore();
        amplifySpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'GET',
                pathParameters: ele.data
            };
            const result = await lambda.getAllBrandDomainsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
