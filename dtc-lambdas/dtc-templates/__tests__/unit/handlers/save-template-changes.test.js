var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
process.env.BucketName = 'dtc-stg-public';
const lambda = require('../../../src/handlers/save-template-changes');
const dynamodb = require('aws-sdk/clients/dynamodb');
const request = {
    'color_annoucement_bar': {
        'bar': '#FAFAFA',
        'text': '#232323'
    },
    'color_background': {
        'header_footer': '#FFFFFF',
        'section': '#FFFFFF'
    },
    'color_button': {
        'background': '#8B0E04',
        'border': '#8B0E04',
        'text': '#FFFFFF'
    },
    'color_text': {
        'body_text': '#232323',
        'heading_links': '#232323',
        'subheading': '#232323'
    },
    'favicon': '11111111',
    'favicon_alt_text': 'favicon',
    'logo': '1111111111111',
    'delete_logo': 'logo-1612943245203',
    'delete_favicon': 'logo-1612943285016',
    'logo_alt_text': 'logo',
    'logo_color': '#8B0E04',
    'typography_body': {
        'font_family': 'HelveticaNeue',
        'font_style': 'Regular'
    },
    'typography_heading': {
        'font_family': 'HelveticaNeue',
        'font_style': 'Regular'
    },
    'typography_subheading': {
        'font_family': 'HelveticaNeue',
        'font_style': 'Regular'
    }
};
const mockData = [{
    'title': 'Required brand id',
    'data': {
        'brand_id': '',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5'
    },
    'status': 0
}, {
    'title': 'Required template id',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': ''
    },
    'status': 0
}, {
    'title': 'Required header and show_announcement to be boolean',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': 'true',
            'homepage_only': 'true',
            'announcement_bar_text': 'hello announce mebnt bar text'
        }
    },
    'status': 0
}, {
    'title': 'Required content_section',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        }
    },
    'status': 0
}, {
    'title': 'Required Product section',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        }
    },
    'status': 0
}, {
    'title': 'Required Product section',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        }
    },
    'status': 0
}, {
    'title': 'Invalid template Id',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': '51f462ba',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'product_section': [
            { 'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1', 'isUpdated': true }
        ],
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        }
    },
    'status': 0
},
{
    'title': 'Save content settings',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'featured_product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
        'product_section': [
            { 'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1', 'isUpdated': true }
        ],
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        }
    },
    'status': 0
},
{
    'title': 'Required content section',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': '51f462ba-decb-4970-84c4-73168004ac62',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'featured_product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1'
    },
    'status': 0
},
{
    'title': 'Save template 5',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'featured_product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
        'product_section': [
            { 'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1', 'isUpdated': true }
        ],
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        },
        'brand_recipe': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'saved_content_section_heading': 'Content Section Heading',
            'saved_content_section_type': 2,
            'card': [
                {
                    'img': '',
                    'body': '',
                    'recipe_id': ''
                },
                {
                    'img': '',
                    'body': '',
                    'recipe_id': ''
                }
            ],
            'product_ids': [
                {
                    'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1'
                },
                {
                    'product_id': '1390c6e2-fb2f-4683-97dd-3c7cbb7e11c0'
                }
            ]
        }
    },
    'status': 0
},
{
    'title': 'Save template 5 store card',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'featured_product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
        'product_section': [
            { 'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1', 'isUpdated': true }
        ],
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        },
        'brand_recipe': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'saved_content_section_heading': 'Content Section Heading',
            'saved_content_section_type': 1,
            'card': [
                {
                    'recipe_id': '03499170-cf6d-11eb-9599-2d5538504def',
                    'img': 's3-1.jpg',
                    'body': 'recipe 1'
                },
                {
                    'img': 's3-1.jpg',
                    'body': 'recipe 2'
                }
            ]
        }
    },
    'status': 0
},
{
    'title': 'Invalid product length',
    'data': {
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'header': {
            'custom_logo': '',
            'show_announcement': true,
            'homepage_only': true,
            'announcement_bar_text': 'hello announce mebnt bar text'
        },
        'featured_product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
        'product_section': [
            { 'product_id': '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1', 'isUpdated': true }
        ],
        'content_section': {
            'show_section': true,
            'heading': 'Content Section Heading',
            'images': [{
                'url': '',
                'show': false,
                'order': 1
            }, {
                'url': '',
                'show': true,
                'order': 2
            }, {
                'url': '',
                'show': true,
                'order': 3
            }]
        },
        'brand_recipe': {
            'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
            'saved_content_section_heading': 'Content Section Heading',
            'saved_content_section_type': 2,
            'product_ids': [
                '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1','1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
                '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1','1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
                '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1','1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1',
                '1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1','1321fbb8-4ad0-4f4e-a097-f7f0fe6c64a1'
            ]
        }
    },
    'status': 0
}
];
describe('Save Template Changes API', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    afterAll(() => {
        putSpy.mockRestore();
    });
    mockData.forEach(ele => {
        it(ele.title, async () => {
            const event = {
                httpMethod: 'POST',
                body: JSON.stringify({ ...ele.data, ...request })
            };
            await lambda.SaveTemplateChangesHandler(event, {}, (error, result)=> {
                expect((JSON.parse(result.body)).status).toBeDefined();
            });
        });
    });
});
