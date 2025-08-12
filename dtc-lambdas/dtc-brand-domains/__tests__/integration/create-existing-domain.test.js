const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('./../../src/handlers/create-existing-domain');
const dynamodb = require('aws-sdk/clients/dynamodb');
const amplify = new AWS.Amplify();
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'domain_name': 'stgdtc.parkstreet.com',
            'brand_name': 'brand-1'
        },
        'status': 0
    },
    {
        'title': 'Domain name is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'brand-1'
        },
        'status': 0
    },
    {
        'title': 'Brand name is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'domain_name': 'stgdtc.parkstreet.com'
        },
        'status': 0
    },
    {
        'title': 'Should able to create existing domain',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'domain_name': 'stgdtc.parkstreet.com',
            'brand_name': 'brand-1'
        },
        'status': 1
    }
];
describe('Test createExistingDomainHandler', () => {
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
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.createExistingDomainHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
