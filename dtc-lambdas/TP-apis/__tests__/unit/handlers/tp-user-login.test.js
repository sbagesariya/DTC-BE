var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-user-login');
const dynamodb = require('aws-sdk/clients/dynamodb');

const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'brand_id': '',
            'secret_token': '2b337579-f2df-4f6c-839b-018dae8bc9fe'
        },
        'haserror': 1
    },
    {
        'title': 'Secret token is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'secret_token': ''
        },
        'haserror': 1
    },
    {
        'title': 'Should test when user not found',
        'data': {
            'brand_id': '1111111111',
            'secret_token': 'bcaa8130-5472-4981-860e-636fc74539ce'
        },
        'haserror': 1
    },
    {
        'title': 'Should able to login TP user',
        'data': {
            'brand_id': '2dc8d9cc-6d6c-4103-bab8-f31e6f9eb57a',
            'secret_token': '09ea300c-0661-4b21-ab75-7ed00adbd73d'
        },
        'haserror': 0
    }
];
describe('Test AddProductInventoryHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.JWT_SECRET = 'parkstreet007dtc';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.ThirdPartyUserLoginHandler(event);
            expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
