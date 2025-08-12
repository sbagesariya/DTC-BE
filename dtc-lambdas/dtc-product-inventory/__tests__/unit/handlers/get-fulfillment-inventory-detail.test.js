var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-fulfillment-inventory-detail');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'CreatedAt is required',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404'
        },
        'status': 0
    },
    {
        'title': 'Fulfillment center Id is required',
        'data': {
            'fulfillment_center_id': '',
            'created_at': '1634108963219'
        },
        'status': 0
    }, {
        'title': 'Get Fulfillment center product inventory details',
        'data': {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'created_at': '1634108963219'
        },
        'status': 1
    }
];
describe('Test fulfillmentProductInventoryHandler', () => {
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
            const result = await lambda.GetfulfillmentInventoryDetailHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
