var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/create-brand-user-with-roles');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Should validate if invalid request',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            },
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }, {
        'title': 'Should validate if invalid request',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'email': 'testuse',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            },
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }, {
        'title': 'Should validate if invalid request',
        'data': {
            'last_name': 'test user',
            'email': 'testuser@gmail.com',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            },
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }, {
        'title': 'Should validate if invalid request',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'email': 'testuser@gmail.com',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            }
        },
        'status': 0
    }, {
        'title': 'Should validate if invalid request',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'email': 'testuser@gmail.com',
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }, {
        'title': 'Should validate user if duplicate email',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'email': 'dcleverley0@wunderground.com',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            },
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }, {
        'title': 'Should create brands user with manager roles',
        'data': {
            'first_name': 'testuser',
            'last_name': 'test user',
            'email': 'aderrickh@mozilla.com',
            'user_roles': {
                'administrator': false,
                'manager': true,
                'information': true,
                'developer': true
            },
            'created_by': '9b9af5d1-d518-4441-9c98-9a477241ab91'
        },
        'status': 0
    }
];
describe('Test CreateBrandUserWithRoles', () => {
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
            const result = await lambda.CreateBrandUserWithRolesHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
