var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/get-retailer-transaction-history');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Retailer id is required',
        'data': {
            'retailer_id': ''
        },
        'status': 0
    },
    {
        'title': 'Should able to get retailer order Summary Card',
        'data': {
            'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
            'limit': 9
        },
        'status': 1
    }
];
describe('Test getRetailerTransactionHistoryHandler', () => {
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
            await lambda.getRetailerTransactionHistoryHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).status).toBeDefined();

            });
        });
    });
});
