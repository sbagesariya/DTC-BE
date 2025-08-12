var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});

const lambda = require('../../../src/handlers/create-brand-products');
const dynamodb = require('aws-sdk/clients/dynamodb');
const mockData = [
    {
        'title': 'Brand Id is required',
        'data': {
            'ABV': '17',
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2
        },
        'status': 0
    },
    {
        'title': 'Product Name is required',
        'data': {
            'ABV': '17',
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'product_type': 'Spirit',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2
        },
        'status': 0
    },
    {
        'title': 'Product Images is required',
        'data': {
            'ABV': '17',
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2
        },
        'status': 0
    },
    {
        'title': 'Product Alcohol Type is required',
        'data': {
            'ABV': '17',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2
        },
        'status': 0
    },
    {
        'title': 'Product ABV is required',
        'data': {
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2
        },
        'status': 0
    },
    {
        'title': 'Product Size Variants is required',
        'data': {
            'ABV': '17',
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'price_matrix': {
                'ground_shipping': {
                    '1.75L': '45',
                    '375_mL': '46',
                    '750_mL': '47'
                },
                'scheduled_delivery': {
                    '1.75L': '48',
                    '375_mL': '49',
                    '750_mL': '50'
                }
            },
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957
        },
        'status': 0
    },
    {
        'title': 'Should able to create-brand-product',
        'data': {
            'ABV': '17',
            'alcohol_type': 'Whisky',
            'availability_count': 1,
            'available_address': {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'state': 'Florida',
                'zip_code': '456456'
            },
            'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
            'createdAt': 1607352352957,
            'description': 'Dummy Product',
            'featured': 'false',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': 45,
            'price_matrix': {
                'ground_shipping': {
                    '1.75L': '45',
                    '375_mL': '46',
                    '750_mL': '47'
                },
                'scheduled_delivery': {
                    '1.75L': '48',
                    '375_mL': '49',
                    '750_mL': '50'
                }
            },
            'product_name': 'Product-55',
            'product_type': 'Spirit',
            'search_product_name': 'product-55',
            'product_images': {
                'img_1': 'product-1619705602826.jpg'
            },
            'shipping': [
                'Ground shipping',
                'Scheduled delivery'
            ],
            'size': [
                '750 mL',
                '375 mL',
                '1.75L'
            ],
            'small_image': 'test.png',
            'tasting_notes': [
                'Good!'
            ],
            'updatedAt': 1607352352957,
            'variants_count': 2,
            'product_size_variants': [
                {
                    'variant_type': 'ml',
                    'variant_size': 125,
                    'upc_code': 1234567800,
                    'product_id': '97a29bf7-f6a3-434d-86eb-3c01b0c6a818',
                    'variant_id': 'd93e0fd6-aa29-405f-a4da-b6f698348d4a',
                    'variant': '125 ml',
                    'sku_code': 445
                },
                {
                    'variant_type': 'ml',
                    'variant_size': 275,
                    'upc_code': 1234567800,
                    'product_id': '97a29bf7-f6a3-434d-86eb-3c01b0c6a818',
                    'variant_id': '23d6fc9e-18ae-4b00-92e3-33de89998554',
                    'variant': '275 ml',
                    'sku_code': 124
                }
            ]
        },
        'status': 0
    },
    {
        'title': 'Should able to update-brand-product',
        'data': {
            'product_id': '4e4e3467-bd0a-4d85-a3af-c7008d0b1aa3',
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'ABV': '12',
            'alcohol_type': 'Spirit',
            'product_name': 'Product-111',
            'description': 'Dummy Product-111',
            'product_images': {
                'img_1': 'product-1618843390932.jpg',
                'img_2': 'product-1618843390785.png'
            },
            'removed_images': ['product-1618843390932.jpg']
        },
        'status': 0
    }
];

describe('Test CreateBrandProductsHandler', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            process.env.PRODUCTS_TABLE = 'Products';
            process.env.SAVED_PRODUCTS_TABLE = 'Saved_products';
            process.env.SIZE_VARIANTS_TABLE = 'Size_variants';
            process.env.PRODUCTS_ADDRESSES_TABLE = 'Products_addresses';
            process.env.CART_TABLE = 'Cart';
            process.env.INVENTORY_TABLE = 'Inventory';
            process.env.BucketName = 'dtc-stg-public';
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify(ele.data)
            };
            const result = await lambda.CreateBrandProductsHandler(event);
            expect((JSON.parse(result.body)).status).toEqual(ele.status);
        });
    });
});
