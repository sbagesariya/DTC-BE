var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-get-sales-order');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Order Id is required',
        'data': {
            'order_id': ''
        },
        'haserror': 1
    },
    {
        'title': 'Sales order not found',
        'data': {
            'order_id': '0699'
        },
        'haserror': 1
    },
    {
        'title': 'Should able to get sales order',
        'data': {
            'order_id': '069998-43585'
        },
        'haserror': 0
    }
];
describe('Test ThirdPartyGetSalesOrderHandler', () => {
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
            const result = await lambda.ThirdPartyGetSalesOrderHandler(event);
            expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
