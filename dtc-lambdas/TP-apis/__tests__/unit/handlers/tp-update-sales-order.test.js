var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-update-sales-order');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Invalid request',
        'data': {
            'po_number': '',
            'order_status': 'Voided',
            'carrier_id': '1111111111111111111',
            'delivery_reference_#': '2222222222222'

        },
        'haserror': 1
    },
    {
        'title': 'Invalid user email',
        'data': {
            'po_number': 'DTC200072',
            'order_status': 'Voideddsdsf',
            'carrier_id': '1111111111111111111',
            'delivery_reference_#': '2222222222222'

        },
        'haserror': 1
    },
    {
        'title': 'Invalid request for date format',
        'data': {
            'po_number': 'Wrong-po_number',
            'order_status': 'Voided',
            'carrier_id': '1111111111111111111',
            'delivery_reference_#': '2222222222222'

        },
        'haserror': 1
    },
    {
        'title': 'Should able to create customer',
        'data': {
            'po_number': 'DTC200072',
            'order_status': 'Voided',
            'carrier_id': '1111111111111111111',
            'delivery_reference_#': '2222222222222'

        },
        'haserror': 0
    }
];
describe('Test ThirdPartyUpdateSalesOrderHandler', () => {
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
                httpMethod: 'PUT',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.ThirdPartyUpdateSalesOrderHandler(event);
            expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
