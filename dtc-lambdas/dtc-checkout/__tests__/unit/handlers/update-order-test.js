var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/update-order');
const dynamodb = require('aws-sdk/clients/dynamodb');
function callbackFunction (err, result) {
    expect((JSON.parse(result.body)).status).toBeDefined();
}
const mockData = [
    {
        'title': 'Order id is required',
        'data': {
            'order': [
                {
                    'created_at': 1638783383431,
                    'payment_detail': {
                        'sub_total': '255.00',
                        'shipping_charge': '0.00',
                        'tax': '15.30',
                        'discount': '0',
                        'promo_code': '',
                        'total': '270.30',
                        'credit_card_fee': '8.11',
                        'stripe_payment_method': 'pm_1K3dcVG3qi1rhSM7kQ2QAMqa',
                        'stripe_payment_intent_id': 'pi_3K3dcTG3qi1rhSM70PU7qucm'
                    }
                }
            ],
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Brand Id is required',
        'data': {
            'order': [
                {
                    'created_at': 1638783383431,
                    'order_id': '383430-2A5E9',
                    'payment_detail': {
                        'sub_total': '255.00',
                        'shipping_charge': '0.00',
                        'tax': '15.30',
                        'discount': '0',
                        'promo_code': '',
                        'total': '270.30',
                        'credit_card_fee': '8.11',
                        'stripe_payment_method': 'pm_1K3dcVG3qi1rhSM7kQ2QAMqa',
                        'stripe_payment_intent_id': 'pi_3K3dcTG3qi1rhSM70PU7qucm'
                    }
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Created date is required',
        'data': {
            'order': [
                {
                    'order_id': '383430-2A5E9',
                    'payment_detail': {
                        'sub_total': '255.00',
                        'shipping_charge': '0.00',
                        'tax': '15.30',
                        'discount': '0',
                        'promo_code': '',
                        'total': '270.30',
                        'credit_card_fee': '8.11',
                        'stripe_payment_method': 'pm_1K3dcVG3qi1rhSM7kQ2QAMqa',
                        'stripe_payment_intent_id': 'pi_3K3dcTG3qi1rhSM70PU7qucm'
                    }
                }
            ],
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Created date is required',
        'data': {
            'order': [
                {
                    'created_at': 'd',
                    'order_id': '383430-2A5E9',
                    'payment_detail': {
                        'sub_total': '255.00',
                        'shipping_charge': '0.00',
                        'tax': '15.30',
                        'discount': '0',
                        'promo_code': '',
                        'total': '270.30',
                        'credit_card_fee': '8.11',
                        'stripe_payment_method': 'pm_1K3dcVG3qi1rhSM7kQ2QAMqa',
                        'stripe_payment_intent_id': 'pi_3K3dcTG3qi1rhSM70PU7qucm'
                    }
                }
            ],
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    },
    {
        'title': 'Should able to update order',
        'data': {
            'order': [
                {
                    'created_at': 1638962000388,
                    'order_id': '383430-2A5E9',
                    'payment_detail': {
                        'sub_total': '255.00',
                        'shipping_charge': '0.00',
                        'tax': '15.30',
                        'discount': '0',
                        'promo_code': '',
                        'total': '270.30',
                        'credit_card_fee': '8.11',
                        'stripe_payment_method': 'pm_1K3dcVG3qi1rhSM7kQ2QAMqa',
                        'stripe_payment_intent_id': 'pi_3K3dcTG3qi1rhSM70PU7qucm'
                    }
                }, {
                    'created_at': 1617969069979,
                    'order_id': '069998-43585',
                    'payment_detail': {
                        'total': '329.00',
                        'shipping_charge': '15.00',
                        'stripe_payment_method': 'pm_1IeIrlG3qi1rhSM7iqecR1z4',
                        'stripe_payment_intent_id': 'pi_1IeIrkG3qi1rhSM7ypjPNAcm',
                        'sub_total': '302.00',
                        'discount': '0',
                        'promo_code': '',
                        'tax': '12.00'
                    }
                }
            ],
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];

describe('Test ConfirmOrderHandler', () => {
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
            await lambda.ConfirmOrderHandler(event, {}, callbackFunction);
        });
    });
});
