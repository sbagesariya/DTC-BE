var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/create-payment-intent');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'brand_id': '8a87b921-e1a8-4df4-ba18-a2930a3badcb',
            'brand_name': 'Brand-1',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': [
                {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '65 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 2,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }
            ],
            'stripe_order_amount': 74
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'brand_id': '8a87b921-e1a8-4df4-ba18-a2930a3badcb',
            'brand_name': 'Brand-1',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_email': '123456',
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': [
                {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '65 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 2,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }
            ],
            'stripe_order_amount': 74
        },
        'status': 0
    },
    {
        'title': 'Invalid request product',
        'data': {
            'brand_id': '8a87b921-e1a8-4df4-ba18-a2930a3badcb',
            'brand_name': 'Brand-1',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_email': 'abc@test.com',
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': [ ],
            'stripe_order_amount': 74
        },
        'status': 0
    },
    {
        'title': 'Brand name is required',
        'data': {
            'brand_id': '8a87b921-e1a8-4df4-ba18-a2930a3badcb',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_email': 'abc@test.com',
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': [
                {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '65 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }
            ],
            'stripe_order_amount': 74
        },
        'status': 0
    },
    {
        'title': 'Brand Id is required',
        'data': {
            'brand_name': 'Brand-1',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_email': 'abc@test.com',
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': '',
            'stripe_order_amount': 74
        },
        'status': 0
    },
    {
        'title': 'Should able to place order',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'brand_name': 'Brand-3',
            'delivery_address': {
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'street': '600',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'user_email': 'arathod@parkstreet.com',
            'user_detail': {
                'first_name': 'tesst',
                'last_name': 'tesst',
                'phone': '9879879687',
                'date_of_birth': '2000-12-6'
            },
            'instructions': '',
            'gift_note': '',
            'accept_terms': true,
            'newsletter': true,
            'cardType': 'visa',
            'billing_address': {
                'same_as_delivery': true,
                'first_name': 'test',
                'last_name': 'test',
                'address_line_1': 'W College Ave',
                'city': 'Tallahassee',
                'state': 'FL',
                'zip_code': '32306'
            },
            'payment_detail': {
                'sub_total': '50.00',
                'shipping_charge': '12.00',
                'tax': '12.00',
                'discount': '0',
                'promo_code': '',
                'total': '74.00'
            },
            'product_detail': [
                {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '65 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 2,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }, {
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'product_id': '58962402-5a15-4dcd-bf3b-c365db7ed474',
                    'price': 50,
                    'qty': 1,
                    'size': '235 ml',
                    'name': 'Product-1',
                    'createdAt': 1625049254912
                }
            ],
            'stripe_order_amount': 74
        },
        'status': 1
    }
];
describe('Test CreatePaymentIntentHandler', () => {
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
            const result = await lambda.CreatePaymentIntentHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
