
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('./../../src/handlers/get-fulfillment-data');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'brand_id': ''
        },
        'status': 0
    },
    {
        'title': 'Able to get preference',
        'data': {
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    }
];

describe('Test FulfillmentHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
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
            const result = await lambda.FulfillmentHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
