var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
const lambda = require('../../../src/handlers/get-shipping-rate-details');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Invalid request',
        data: {
            'sub_total': 100.01,
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        data: {
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        data: {
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        data: {
            'sub_total': 100.01,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            }
        },
        'status': 0
    },
    {
        'title': 'Invalid request',
        data: {
            'sub_total': 100.01,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    }, {
        'title': 'Invalid request',
        data: {
            'sub_total': 100.01,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            }
        },
        'status': 0
    }, {
        'title': 'Invalid request',
        data: {
            'sub_total': 100.01,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'fulfillment_center_id': 'Invali_id',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    }, {
        'title': 'Should able to get shippig rate detail of a retailer and fulfillment center',
        data: {
            'sub_total': 100.01,
            'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
            'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
            'state': 'Alabama',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Adami',
            'delivery_address': {
                'address_line_1': '100 MAIN ST',
                'street': 'PO BOX 1023',
                'city': 'SEATTLE',
                'state': 'FL',
                'zip_code': '98104',
                'country': 'US'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 1
    }
];

describe('Test getShippingRateDetailsHandler', () => {
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
            const result = await lambda.getShippingRateDetailsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
