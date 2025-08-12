var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-top-selling-products');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand id is required',
        'data': {
            'from_date': '02/09/2021',
            'to_date': '02/11/2021'
        },
        'status': 0
    },
    {
        'title': 'To date is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'from_date': '02/09/2021'
        },
        'status': 0
    },
    {
        'title': 'Should able to get dashboard order',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'from_date': '03/01/2021',
            'to_date': '08/31/2021'
        },
        'status': 1
    },

    {
        'title': 'Should able to get all dashboard orders',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 1
    }
];
describe('Test getTopSellingProductsHandler', () => {
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
            const result = await lambda.getTopSellingProductsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
