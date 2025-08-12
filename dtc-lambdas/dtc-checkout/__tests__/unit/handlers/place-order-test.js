const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/place-order');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'product_detail': [
                {
                    'product_id': 'de1fa55b-31c7-42d8-ab4b-a38f02728186',
                    'price': 156,
                    'qty': 1,
                    'size': '750 mL',
                    'name': 'Product-13'
                }
            ],
            'stripe_order_amount': 183
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'user_email': 'dcleverley0',
            'product_detail': [
                {
                    'product_id': 'de1fa55b-31c7-42d8-ab4b-a38f02728186',
                    'price': 156,
                    'qty': 1,
                    'size': '750 mL',
                    'name': 'Product-13'
                }
            ],
            'stripe_order_amount': 183
        },
        'status': 0
    },
    {
        'title': 'Invalid request product',
        'data': {
            'user_email': 'dcleverley0@wunderground.com',
            'stripe_order_amount': 183
        },
        'status': 0
    },
    {
        'title': 'Should able to user place order',
        'data': {
            'billing_address': {
                'address_line_1': 'Beverly Boulevard',
                'city': 'Los Angeles',
                'first_name': 'Tesher',
                'last_name': '',
                'state': 'CA',
                'zip_code': '90048'
            },
            'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
            'brand_name': 'Brand-2',
            'createdAt': 1619765274339,
            'delivery_address': {
                'address_line_1': 'Beverly Boulevard',
                'city': 'Los Angeles',
                'first_name': 'Tesher',
                'last_name': '',
                'state': 'CA',
                'street': '8500',
                'zip_code': '90048'
            },
            'estimated_delivery_date': 1620024474339,
            'gift_note': '',
            'instructions': '',
            'newsletter': true,
            'order_id': '274339-BAA99',
            'order_status': 'Received',
            'payment_detail': {
                'discount': '60.9',
                'promo_code': 'FREESHIP',
                'shipping_charge': '15.00',
                'stripe_payment_intent_id': 'pi_1Ilq8mG3qi1rhSM740cDuEdx',
                'stripe_payment_method': 'pm_1Ilq8nG3qi1rhSM7Q7sZtlfT',
                'sub_total': '609.00',
                'tax': '12.00',
                'total': '575.10'
            },
            'product_detail': [
                {
                    'name': 'Product-2',
                    'price': 65,
                    'product_id': '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
                    'qty': 6,
                    'size': '1.75L'
                },
                {
                    'name': 'Product-8',
                    'price': 73,
                    'product_id': '1fcd3755-b023-4283-8bbe-077acd57c92c',
                    'qty': 3,
                    'size': '750 mL'
                }
            ],
            'retailer': 'Collin Retailer Finlason',
            'retailer_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
            'search_brand_name': 'brand-2',
            'search_estimated_delivery_date': '05/03/2021',
            'search_order_id': '274339-baa99',
            'search_placed_on': '04/30/2021',
            'search_retailer': 'collin retailer finlason',
            'search_state': 'ca',
            'search_status': 'received',
            'search_total': 575.1,
            'search_user_name': 'tesher test',
            'sort_brand_name': 'brand-2',
            'sort_order_id': '274339-BAA99',
            'sort_state': 'CA',
            'sort_total': 575.1,
            'updatedAt': 1619764956656,
            'user_detail': {
                'date_of_birth': '2000-12-12',
                'first_name': 'Tesher',
                'last_name': 'test',
                'phone': '98243567',
                'user_type': 'guest'
            },
            'user_email': 'msharma@parkstreet.com'
        },
        'status': 1
    }
];
describe('Test PlaceOrderHandler', () => {
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
            const result = await lambda.PlaceOrderHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
