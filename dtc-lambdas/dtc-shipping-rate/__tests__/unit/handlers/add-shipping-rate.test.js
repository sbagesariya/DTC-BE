const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'local') {
    db.aws.ddb.local('http://localhost:8000');
}
const lambda = require('../../../src/handlers/add-shipping-rate');
// Import dynamodb from aws-sdk
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [{
    'title': 'Shipping options is required',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_tier': [
            {
                'tier_order': 1,
                'tier_starts': 0,
                'tier_ends': 100,
                'tier_amount': 10
            },	{
                'tier_order': 2,
                'tier_starts': 101,
                'tier_ends': 200,
                'tier_amount': 20
            }]
    },
    'status': 0
},
{
    'title': 'Retailer id is required',
    'data': {
        'retailer_id': '',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 2,
        'shipping_tier': [
            {
                'tier_order': 1,
                'tier_starts': 0,
                'tier_ends': 100,
                'tier_amount': 10
            },	{
                'tier_order': 2,
                'tier_starts': 101,
                'tier_ends': 200,
                'tier_amount': 20
            }]
    },
    'status': 0
}, {
    'title': 'Retailer name is required',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'shipping_option': 2,
        'shipping_tier': [
            {
                'tier_order': 1,
                'tier_starts': 0,
                'tier_ends': 100,
                'tier_amount': 10
            },	{
                'tier_order': 2,
                'tier_starts': 101,
                'tier_ends': 200,
                'tier_amount': 20
            }]
    },
    'status': 0
}, {
    'title': 'Shipping flat amount is required in shipping option 1',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'ship_rate_flat_amount': ''
    },
    'status': 0
}, {
    'title': 'Shipping tier is all the required array of data should be valid in shipping option 2',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 2,
        'shipping_tier': [
            {
                'tier_order': 1,
                'tier_starts': 0,
                'tier_ends': 100,
                'tier_amount': ''
            },	{
                'tier_order': 2,
                'tier_starts': 101,
                'tier_ends': 200,
                'tier_amount': 20
            }]
    },
    'status': 0
}, {
    'title': 'Should add 0 shipping amount in shipping option 3',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 3
    },
    'status': 1
}, {
    'title': 'Should able to add shipping rate in shipping optino 2',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 2,
        'shipping_tier': [
            {
                'tier_order': 1,
                'tier_starts': 0,
                'tier_ends': 100,
                'tier_amount': 10
            },	{
                'tier_order': 2,
                'tier_starts': 101,
                'tier_ends': 200,
                'tier_amount': 20
            }]
    },
    'status': 1
},
{
    'title': 'Should give validation if invalid shipping tier in shipping optino 2',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 2,
        'shipping_tier': []
    },
    'status': 0
},
{
    'title': 'Should validate if shipping flat amount is not given in option 1',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 1
    },
    'status': 0
},
{
    'title': 'Should able to add shipping flat amount in shipping optino 1',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 1,
        'ship_rate_flat_amount': 50
    },
    'status': 1
},
{
    'title': 'Should not able to add if invalid option given',
    'data': {
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'shipping_option': 5,
        'ship_rate_flat_amount': 50
    },
    'status': 0
}
];

// This includes all tests for putItemHandler()
describe('Test AddShippingRateHandler', () => {
    let putSpy;

    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown
    beforeAll(() => {
        // Mock dynamodb get and put methods
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });

    // Clean up mocks
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const returnedItem = {
                'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                'retailer_name': 'Dominica Retailer Cleverley',
                'shipping_option': 2,
                'shipping_tier': [
                    {
                        'tier_order': 1,
                        'tier_starts': 0,
                        'tier_ends': 100,
                        'tier_amount': 10
                    },	{
                        'tier_order': 2,
                        'tier_starts': 101,
                        'tier_ends': 200,
                        'tier_amount': 20
                    }]
            };

            // Return the specified value whenever the spied put function is called
            putSpy.mockReturnValue({
                promise: () => Promise.resolve(returnedItem)
            });

            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };

            // Invoke putItemHandler()
            const result = await lambda.AddShippingRateHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
    // This test invokes putItemHandler() and compare the result
});
