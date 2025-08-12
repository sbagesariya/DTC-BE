
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-alcohol-type-by-brand');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'brand_id': ''
        },
        'status': 0
    },
    {
        'title': 'should get Alcohol Types by brand id',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];
describe('Test alcoholTypesByBrandHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'GET',
                pathParameters: ele.data
            };
            const result = await lambda.alcoholTypesByBrandHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
