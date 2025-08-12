
var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/check-product-availability');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'productId': '',
            'postalCode': '32306',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Postal code is required',
        'data': {
            'brandId': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'productId': '',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Latitude is required',
        'data': {
            'brandId': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'productId': '',
            'postalCode': '32306',
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Longitude is required',
        'data': {
            'brandId': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'productId': '',
            'postalCode': '32306',
            'lat': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Invalid product Id',
        'data': {
            'brandId': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'productId': '04b6a7b0-e430-4492-b8dd-6cac04cee094',
            'postalCode': '32306',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Invalid postal code',
        'data': {
            'brandId': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'productId': '',
            'postalCode': '12345',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Should able to check-availability-products without product id',
        'data': {
            'brandId': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'postalCode': '32306',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 1
    },
    {
        'title': 'Should able to check-availability-products',
        'data': {
            'brandId': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'productId': '9083ba64-7ef5-4467-9674-085d4c666041',
            'postalCode': '32306',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    },
    {
        'title': 'Should able to check-availability-products',
        'data': {
            'brandId': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'postalCode': '90209',
            'lat': 34.0751706,
            'lng': -118.3773546
        },
        'status': 0
    }

];

describe('Test ProductAvailabilityHandler', () => {
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
            const result = await lambda.ProductAvailabilityHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
