var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/create-account');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Invalid user email',
        'data': {
            'email': 'arathod',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Brand name is required',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Brand website is required',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Brand id is required',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_website': 'https://www.parkstreet.com/',
            'brand_name': 'Brand-2'
        },
        'status': 0
    },
    {
        'title': 'Password and Confirm Password does not match',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test123',
            'confirm_password': 'test1234',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Email already exists',
        'data': {
            'email': 'wmaccarlich9@fc2.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 0
    },
    {
        'title': 'Should able to user create account',
        'data': {
            'email': 'arathod@parkstreet.com',
            'password': 'test123',
            'confirm_password': 'test123',
            'profilePicture': '',
            'first_name': 'Akash',
            'last_name': 'Rathod',
            'phone': '123456789',
            'date_of_birth': 1610104240913,
            'brand_name': 'Brand-2',
            'brand_website': 'https://www.parkstreet.com/',
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191'
        },
        'status': 1
    }
];
describe('Test CreateAccountHandler', () => {
    let getSpy;
    beforeAll(() => {
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'query');
    });
    afterAll(() => {
        getSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.JWT_SECRET = 'parkstreet007dtc';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.CreateAccountHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });

    });
});
