var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-get-customer');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Customer Id is required',
        'data': {
            'customer_id': ''
        },
        'haserror': 1
    },
    {
        'title': 'Customer not found',
        'data': {
            'customer_id': '08d767bb'
        },
        'haserror': 1
    },
    {
        'title': 'Should able to get customer',
        'data': {
            'customer_id': 'DTC-TES-2D61ED'
        },
        'haserror': 0
    }
];
describe('Test ThirdPartyGetCustomerHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
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
            const result = await lambda.ThirdPartyGetCustomerHandler(event);
            expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
