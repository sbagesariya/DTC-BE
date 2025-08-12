var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
    // endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/validate-order-compliance');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Order ship compliant validate with fail response',
        'data': {
            'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
            'brand_name': 'Adami'
        },
        'status': 0
    },
    {
        'title': 'Order ship compliant validate with fail response',
        'data': {
            'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
            'brand_name': 'Adami',
            'user_email': 'sdfsdfsd'
        },
        'status': 0
    },
    {
        'title': 'Order ship compliant validate with fail response',
        'data': {
            'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
            'brand_name': 'Adami',
            'user_email': 'arathod@parkstreet.com'
        },
        'status': 0
    },
    {
        'title': 'Order ship compliant validate with fail response',
        'data': {
            'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
            'user_email': 'arathod@parkstreet.com',
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'name': 'Superiore Brut NV 12/750ml 11%',
                    'fulfillment_center_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Order ship compliant validate with fail response',
        'data': {
            'brand_name': 'Adami',
            'user_email': 'arathod@parkstreet.com',
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'name': 'Superiore Brut NV 12/750ml 11%',
                    'fulfillment_center_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Order ship compliant validate with success response',
        'data': {
            'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
            'brand_name': 'Adami',
            'delivery_address': {
                'first_name': 'Akash',
                'last_name': 'Rathod',
                'address_line_1': 'Brickell Avenue',
                'street': '1000',
                'city': 'Miami',
                'state': 'FL',
                'full_state': 'Florida',
                'zip_code': '33131',
                'country': 'US'
            },
            'user_email': 'arathod@parkstreet.com',
            'user_detail': {
                'first_name': 'Akash',
                'last_name': 'Rathod',
                'phone': '1234567890',
                'date_of_birth': '1991-08-31'
            },
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'Akash',
                'last_name': 'Rathod',
                'address_line_1': 'Brickell Avenue',
                'city': 'Miami',
                'state': 'FL',
                'country': 'US',
                'zip_code': '33131'
            },
            'payment_detail': {
                'sub_total': '150.00',
                'shipping_charge': '0.00',
                'tax': '7.80',
                'discount': '0',
                'promo_code': '',
                'total': '157.80'
            },
            'product_detail': [
                {
                    'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
                    'price': 150,
                    'qty': 1,
                    'size': '750 ml',
                    'name': 'Superiore Brut NV 12/750ml 11%',
                    'fulfillment_center_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'sku_code': 'UVE-GB32NV'
                }
            ]
        },
        'status': 1
    }
];

describe('Test ValidateOrderComplianceHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.SHIP_COMPLAINCE_API_URL = 'https://restapi-staging.shipcompliant.com';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            await lambda.ValidateOrderComplianceHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).status).toBeDefined();
            });
        });
    });
});
