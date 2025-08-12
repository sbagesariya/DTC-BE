var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/update-users-role');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should test invalid request parameter if email is not there',
        'data': [{
            'user_roles': {
                'administrator': false,
                'information': true,
                'developer': true,
                'manager': true
            }
        }],
        'status': 0
    }, {
        'title': 'Should test invalid request parameter',
        'data': {},
        'status': 0
    }, {
        'title': 'Should test invalid request parameter if email is not there',
        'data':  [{
            'email': ' ',
            'user_roles': ' '
        }],
        'status': 0
    }, {
        'title': 'Should test invalid request parameter if email is not there',
        'data': [{
            'email': 'jleteve7@typepad.com',
            'user_id': '8ffb6faf-8df3-4095-8a29-a27c4219d99a',
            'user_roles': {
                'administrator': false,
                'information': true,
                'developer': true,
                'manager': true
            }
        }],
        'status': 1
    }
];
describe('Test UpdateUsersRoleHandler', () => {
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
                httpMethod: 'PUT',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.UpdateUsersRoleHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
