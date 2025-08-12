var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/tp-create-customer');
const dynamodb = require('aws-sdk/clients/dynamodb');
const newCustomer = 'test' + new Date().getTime();
const mockData = [
    {
        'title': 'Invalid request',
        'data': {
            'email': ''
        },
        'haserror': 1
    },
    {
        'title': 'Invalid user email',
        'data': {
            'email': 'test1234',
            'first_name': 'Test',
            'last_name': 'Test',
            'phone': '9898989898',
            'date_of_birth': '2021/09/01'
        },
        'haserror': 1
    },
    {
        'title': 'Invalid request for date format',
        'data': {
            'email': 'test@gmail.com',
            'first_name': 'Test',
            'last_name': 'Test',
            'phone': '9898989898',
            'date_of_birth': '09/24/2000'
        },
        'haserror': 1
    },
    {
        'title': 'Should able to create customer',
        'data': {
            'email': 'test1@gmail.com',
            'first_name': 'Test',
            'last_name': 'Test',
            'phone': '9898989898',
            'date_of_birth': '2021/09/01'
        },
        'haserror': 1
    },
    {
        'title': 'Should able to create customer',
        'data': {
            'email': newCustomer + '@gmail.com',
            'first_name': 'Test',
            'last_name': 'Test',
            'phone': '9898989898',
            'date_of_birth': '2021/09/01'
        },
        'haserror': 0
    }
];
describe('Test ThirdPartyCreateCustomerHandler', () => {
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
            const result = await lambda.ThirdPartyCreateCustomerHandler(event);
            expect((JSON.parse(result.body)).haserror).toEqual(ele.haserror);
        });
    });
});
