var AWS = require('aws-sdk');
var ssm = new AWS.SSM({ region: 'us-east-1' });
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/shopping-cart-overview');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'domain': 'stgdtc.parkstreet.com',
            'from_date': '01/10/2019',
            'to_date': '08/24/2021'
        },
        'status': 0
    },
    {
        'title': 'Domain name is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'from_date': '01/10/2019',
            'to_date': '08/24/2021'
        },
        'status': 0
    },
    {
        'title': 'From date is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'domain': 'stgdtc.parkstreet.com',
            'to_date': '08/24/2021'
        },
        'status': 0
    },
    {
        'title': 'To date is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'domain': 'stgdtc.parkstreet.com',
            'from_date': '08/24/2021'
        },
        'status': 0
    }, {
        'title': 'Shoud shopping cart overview',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'domain': 'stgdtc.parkstreet.com',
            'from_date': '08/24/2021',
            'to_date': '08/24/2021'
        },
        'status': 1
    }
];
describe('Test shoppingCartOverviewHandler', () => {
    let getSpy;
    let ssmSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
        ssmSpy = jest.spyOn(ssm, 'getParameter').mockImplementation(() => Promise.resolve());
    });
    afterAll(() => {
        getSpy.mockRestore();
        ssmSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const ssmValue = { Parameter: { Value: 'https://test.com' } };
            ssmSpy.mockReturnValue({
                promise: () => Promise.resolve({ Parameter: ssmValue })
            });
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.shoppingCartOverviewHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
