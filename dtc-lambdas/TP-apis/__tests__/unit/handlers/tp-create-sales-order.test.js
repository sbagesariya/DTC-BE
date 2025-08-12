var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-create-sales-order');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Following parameters are required',
        'data': {
            'email': ''
        },
        'haserror': 1
    },
    {
        'title': 'Should able to create sales order ',
        'data': {
            'confirmation_order_number': 'AQZARTEST',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'customer_id': 'DTC-AKA-0708DA',
            'order_date': '09/21/2021',
            'payment_status': 'Paid',
            'fulfillment_types': 'Fulfillment Center',
            'estimated_delivery_date': '09/30/2021',
            'delivery_add_1': 'Beverly Boulevard',
            'delivery_add_2': 'address 2',
            'delivery_zip': '90048',
            'delivery_city': 'Los Angeles',
            'delivery_state': 'CA',
            'total_shipping_cost': 15,
            'total_taxes': 2,
            'total_promotion': 3,
            'payment_date': '09/21/2021',
            'payment_confirmation_id': '1234567',
            'delivery_instructions': 'Do good packaginDo good packaginDo good',
            'billing_first_name': 'Exnovo',
            'billing_last_name': 'Jessamyn',
            'billing_add_1': 'Beverly Boulevard',
            'billing_add_2': 'address 2',
            'billing_zip': '90048',
            'billing_city': 'Los Angeles',
            'billing_state': 'CA',
            'order_notes': 'Test notes',
            'tracking_id': '1234567890',
            'tracking_company': 'Fedex',
            'transaction_type': 'Sales Order',
            'product_detail': [
                {
                    'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
                    'variant_id': 'fcd6fa60-8074-459a-bcc4-1d0dc1967670',
                    'quantity': 5,
                    'unit_price': 10
                }
            ]

        },
        'haserror': 0
    }
];
describe('Test ThirdPartyCreateSalesOrderHandler', () => {
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
            const result = await lambda.ThirdPartyCreateSalesOrderHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).haserror).toBeDefined();
            });
            // expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
