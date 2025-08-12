const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-brand-by-company');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'company_id': ''
        },
        'status': 0
    },
    {
        'title': 'No Data found',
        'data': {
            'company_id': '8cb2c29c-6b2a-4107-8032'
        },
        'status': 0
    },
    {
        'title': 'Should able to get brand by company',
        'data': {
            'company_id': '8cb2c29c-6b2a-4107-8032-2ca1ef37c22a'
        },
        'status': 1
    }
];
describe('Test getBrandByCompanyHandler', () => {
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
                httpMethod: 'GET',
                pathParameters: ele.data
            };
            const result = await lambda.getBrandByCompanyHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
