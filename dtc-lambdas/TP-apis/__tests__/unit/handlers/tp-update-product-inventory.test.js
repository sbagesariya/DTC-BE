var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-update-product-inventory');
const dynamodb = require('aws-sdk/clients/dynamodb');
function callbackFunction (erro, result) {
    console.log('result*************',result)
    expect((JSON.parse(result.body)).data).toBeDefined();
}
const mockData = [
    {
        'title': 'Invalid request',
        'data': {

        },
        'haserror': 1
    },
    {
        'title': 'Invalid request',
        'data': [
            {
                'product_id': 'LNJ-CHARDSAMP-NV',
                'total_on_hand': 10
            }
        ],
        'haserror': 1
    },
    {
        'title': 'Should able to update product inventory',
        'data': [
            {
                'product_id': 'LNJ-CHARDSAMP-NV',
                'total_on_hand': 10,
                'amount': 250,
                'warehouse': 'CA Convoy Beverage Alliance',
                'location': 'UKX'
            },
            {
                'product_id': 'LNJ-CABSAMP-NV',
                'total_on_hand': 20,
                'amount': 200,
                'warehouse': 'CA Convoy Beverage Alliance',
                'location': 'CBA Tax Paid'
            }
        ],
        'haserror': 0
    }
];
describe('Test ThirdPartyUpdateInventoryHandler', () => {
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
            await lambda.ThirdPartyUpdateInventoryHandler(event, {}, callbackFunction);
        });
    });
});


