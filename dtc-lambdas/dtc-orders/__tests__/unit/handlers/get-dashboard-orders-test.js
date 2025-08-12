var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-dashboard-orders');
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
        'title': 'Form date is required',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'to_date': '02/11/2021'
        },
        'status': 0
    },
    {
        'title': 'To date is required',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'from_date': '02/09/2021'
        },
        'status': 0
    },
    {
        'title': 'Should able to get dashboard order',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
            'from_date': '02/09/2021',
            'to_date': '02/11/2021'
        },
        'status': 1
    },

    {
        'title': 'Should able to get all dashboard orders',
        'data': {
            'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51'
        },
        'status': 1
    }
];
describe('Test getDashboardOrdersHandler', () => {
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
            const result = await lambda.getDashboardOrdersHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});