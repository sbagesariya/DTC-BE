var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/get-retailers-by-product');
const dynamodb = require('aws-sdk/clients/dynamodb');
process.env.BucketName = 'dtc-stg-public';
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'qty': 1,
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Product Id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'qty': 1,
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Size is required',
        'data': {
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'qty': 1,
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Quantity is required',
        'data': {
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'State is required',
        'data': {
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'size': '120 ml',
            'postalCode': '33315',
            'qty': 1,
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Postal code is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'qty': 1,
            'size': '120 ml',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Latitude is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'qty': 1,
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lng': -80.1544184
        },
        'status': 0
    },
    {
        'title': 'Longitude is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'qty': 1,
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936
        },
        'status': 0
    },
    {
        'title': 'Should able to get retailer products',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
            'qty': 1,
            'size': '120 ml',
            'postalCode': '33315',
            'state': 'Florida',
            'lat': 26.0914936,
            'lng': -80.1544184
        },
        'status': 1
    }
];

// This includes all tests for getRetailersByProductHandler()
describe('Test getRetailersByProductHandler', () => {
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
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            // Invoke getRetailersByProductHandler()
            const result = await lambda.getRetailersByProductHandler(event);
            // Compare the result with the expected result
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
