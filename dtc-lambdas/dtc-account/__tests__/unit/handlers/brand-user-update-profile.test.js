var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/brand-user-update-profile');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Email is required',
        'data': {
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'new_password': 'test1234',
            'confirm_password': 'test1234'
        },
        'status': 0
    },
    {
        'title': 'New password is required',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'confirm_password': 'test1234'
        },
        'status': 0
    },
    {
        'title': 'Confirm password is required',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'new_password': 'test1234'
        },
        'status': 0
    },
    {
        'title': 'Password and Confirm Password does not match',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'new_password': 'test1235',
            'confirm_password': 'test1238'
        },
        'status': 0
    },
    {
        'title': 'User not found',
        'data': {
            'email': 'aderrickh_007@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'new_password': 'test1234',
            'confirm_password': 'test1234'
        },
        'status': 0
    },
    {
        'title': 'Wrong password',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test12345678',
            'new_password': 'test1234',
            'confirm_password': 'test1234'
        },
        'status': 0
    },
    {
        'title': 'Should able to user update the password',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png',
            'password': 'test123',
            'new_password': 'test1234',
            'confirm_password': 'test1234'
        },
        'status': 1
    },
    {
        'title': 'First name is required',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png'
        },
        'status': 0
    },
    {
        'title': 'Should able to user edit profile',
        'data': {
            'email': 'aderrickh@mozilla.com',
            'first_name': 'Ader',
            'last_name': 'Rickh',
            'profilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789661.png',
            'removeProfilePicture': 'https://dtc-stg-public.s3.amazonaws.com/prefix-1616684789660.png'
        },
        'status': 1
    }
];
describe('Test BrandUserUpdateProfileHandler', () => {
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
                httpMethod: 'PUT',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.BrandUserUpdateProfileHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
