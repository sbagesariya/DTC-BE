var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const lambda = require('../../../src/handlers/add-to-cart');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'user_id': '0ybt5w68h1',
            'product_details': [
                {
                    'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
                    'sku_code': 'LNJ-CABSAMP-NV',
                    'qty': 1,
                    'price': 12.00,
                    'product_name': 'Product-162',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
                    'size': '99 ml'
                },
                {
                    'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
                    'sku_code': 'LNJ-CABABC-NV',
                    'qty': 2,
                    'price': 80.00,
                    'product_name': 'Product-163',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'size': '12 ml'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'User Id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_details': [
                {
                    'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
                    'sku_code': 'LNJ-CABSAMP-NV',
                    'qty': 1,
                    'price': 12.00,
                    'product_name': 'Product-162',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
                    'size': '99 ml'
                },
                {
                    'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
                    'sku_code': 'LNJ-CABABC-NV',
                    'qty': 2,
                    'price': 80.00,
                    'product_name': 'Product-163',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'size': '12 ml'
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'User Id is required',
        'data': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'user_id': '0ybt5w68h1'
        },
        'status': 0
    },
    {
        'title': 'Should able to add to cart',
        'data': {
            'user_id': '0ybt5w68h1',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'product_details': [
                {
                    'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
                    'sku_code': 'LNJ-CABSAMP-NV',
                    'qty': 1,
                    'price': 12.00,
                    'product_name': 'Product-162',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
                    'size': '99 ml'
                },
                {
                    'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
                    'sku_code': 'LNJ-CABABC-NV',
                    'qty': 2,
                    'price': 80.00,
                    'product_name': 'Product-163',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'size': '12 ml'
                }
            ]
        },
        'status': 1
    },
    {
        'title': 'Should able to update the cart',
        'data': {
            'user_id': '0ybt5w68h1',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'cart_id': '8e822460-a42d-11ec-ae06-517e8e4bdb9c',
            'product_details': [
                {
                    'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
                    'sku_code': 'LNJ-CABSAMP-NV',
                    'qty': 10,
                    'price': 12.00,
                    'product_name': 'Product-162',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
                    'size': '99 ml'
                },
                {
                    'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
                    'sku_code': 'LNJ-CABABC-NV',
                    'qty': 4,
                    'price': 80.00,
                    'product_name': 'Product-163',
                    'product_img': 'https://dtc-stg-public.s3.amazonaws.com/product-1622549139427.jpeg',
                    'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
                    'size': '12 ml'
                }
            ]
        },
        'status': 1
    },
    {
        'title': 'Should able to add to cart',
        'data': {
            'brandId': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'productId': '02edf730-8d72-11eb-b782-dd03d6860089',
            'userId': '08e4f5b5-47f6-4a74-b3a0-b90886813c2d',
            'size': '12 ml',
            'price': '25',
            'qty': '2'
        },
        'status': 1
    }
];
describe('Test addToCartHandler', () => {
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
            const result = await lambda.addToCartHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
