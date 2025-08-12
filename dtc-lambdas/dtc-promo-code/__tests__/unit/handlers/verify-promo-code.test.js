var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/verify-promo-code');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Error: Promo Code Not Found',
        'data': {
            'promo_code': 'FLAT26'
        },
        'status': 0
    },
    {
        'title': 'Should able to get promo code',
        'data': {
            'promo_code': 'NEW50',
            'sub_total': 1000
        },
        'status': 1
    }
];
describe('Test verifyPromoCodeHandler', () => {
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
            const result = await lambda.verifyPromoCodeHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
