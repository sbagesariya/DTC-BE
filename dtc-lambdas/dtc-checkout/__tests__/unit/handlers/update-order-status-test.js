var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

function callbackFunction (err, result) {
    expect((JSON.parse(result.body)).status).toBeDefined();
}
const lambda = require('../../../src/handlers/update-order-status');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Order id is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Confirmed'
        },
        'status': 0
    },
    {
        'title': 'Order status is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'order_id': '490248-FF65B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69'
        },
        'status': 0
    },
    {
        'title': 'Brand Id is required',
        'data': {
            'order_id': '490248-FF65B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Confirmed'
        },
        'status': 0
    },
    {
        'title': 'Created date is required',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'order_id': '490248-FF65B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Confirmed'
        },
        'status': 0
    },
    {
        'title': 'Order not found',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'order_id': '490248-FF325B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Confirmed',
            'createdAt': 1615360434608
        },
        'status': 0
    },
    {
        'title': 'Invalid data',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'order_id': '490248-FF65B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Shipped'
        },
        'status': 0
    },
    {
        'title': 'Should able to update status',
        'data': {
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'order_id': '490248-FF65B',
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'order_status': 'Shipped',
            'createdAt': 1615360434608
        },
        'status': 1
    }
];

describe('Test UpdateOrderStatusHandler', () => {
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
            await lambda.UpdateOrderStatusHandler(event, {}, callbackFunction);
        });
    });
});
