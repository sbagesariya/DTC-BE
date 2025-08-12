const UUID = require('uuid');
const FE_URL = 'https://stgdtc.parkstreet.com/';
const companies = [
    {
        company_id: '8cb2c29c-6b2a-4107-8032-2ca1ef37c22a',
        company_name: 'Company-A',
        description: '',
        company_logo: ''
    }, {
        company_id: '4c3335c3-ed89-4a33-80c4-9cb19262bfa5',
        company_name: 'Company-B',
        description: '',
        company_logo: ''
    }, {
        company_id: '7c026a5b-36ea-4493-be70-998ed47f2140',
        company_name: 'Company-C',
        description: '',
        company_logo: ''
    }, {
        company_id: 'ab2fcb8e-eac8-46a3-b708-d580e6a23da4',
        company_name: 'Company-D',
        description: '',
        company_logo: ''
    }, {
        company_id: 'a01adf54-5fb8-481c-bb17-dcfa668036e3',
        company_name: 'Company-E',
        description: '',
        company_logo: ''
    }
];
const headingImage = [{
    'img': 'first_img.png',
    'url': FE_URL
}, {
    'img': 'first_img.png',
    'url': FE_URL
}, {
    'img': 'first_img.png',
    'url': FE_URL
}];
// Brands Test Data
const brands = [
    {
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'company_name': companies[0].company_name,
        'company_id': companies[0].company_id,
        'brand_name': 'Brand-1',
        'heading_images': headingImage,
        'brand_logo': 'Brand1.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-1'
    }, {
        'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
        'company_name': companies[1].company_name,
        'company_id': companies[1].company_id,
        'brand_name': 'Brand-2',
        'heading_images': headingImage,
        'brand_logo': 'Brand2.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-2'
    }, {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91', // Brand user
        'company_name': companies[2].company_name,
        'company_id': companies[2].company_id,
        'brand_name': 'Brand-3',
        'heading_images': headingImage,
        'brand_logo': 'Brand3.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-3'
    }, {
        'brand_id': '1473b1ee-b165-4691-9a25-bfe243430191',
        'company_name': companies[3].company_name,
        'company_id': companies[3].company_id,
        'brand_name': 'Brand-4',
        'heading_images': headingImage,
        'brand_logo': 'Brand4.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-4'
    }, {
        'brand_id': '14c36bb1-7771-4197-8440-56e91bec7d65',
        'company_name': companies[4].company_name,
        'company_id': companies[4].company_id,
        'brand_name': 'Brand-5',
        'heading_images': headingImage,
        'brand_logo': 'Brand5.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-5'
    },
    {
        'brand_id': '2545b6ce-ca64-4ba2-b8c4-db5fa8a81c8d',
        'company_name': companies[0].company_name,
        'company_id': companies[0].company_id,
        'brand_name': 'Brand-6',
        'heading_images': headingImage,
        'brand_logo': 'Brand6.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-6'
    },
    {
        'brand_id': '08e4f5b5-47f6-4a74-b3a0-b90886813c2d', // Brand user
        'company_name': companies[1].company_name,
        'company_id': companies[1].company_id,
        'brand_name': 'Brand-7',
        'heading_images': headingImage,
        'brand_logo': 'Brand7.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-7'
    },
    {
        'brand_id': '2d9f9b7d-51a7-494a-936d-239ef47a7169', // Brand user
        'company_name': companies[2].company_name,
        'company_id': companies[2].company_id,
        'brand_name': 'Brand-8',
        'heading_images': headingImage,
        'brand_logo': 'Brand8.png',
        'heading_text': 'Award Winning',
        'brand_website': FE_URL,
        'search_brand_name': 'brand-8'
    }
];
const productIds = [
    '332823dd-3962-4444-a2bf-6d8a9c5583ef',
    'fe605930-ac70-49c3-94c1-7e1992bec7a3',
    'ffc668fe-3130-4761-94ae-b9b5fb23c3a3',
    '9ade024b-c291-48b2-af66-0c507ea5614d',
    '9a7e228a-fbba-46a3-be2b-775f8c978046'
];
// Product Test Data
const products = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const price = 11 + j;
        const testData = {
            'product_id': (i === 0) ? productIds[j] : UUID.v4(),
            'brand_id': brands[i].brand_id,
            'ABV': '12',
            'alcohol_type': 'Spirit',
            'description': 'Dummy Product',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': price,
            'product_name': `Product-${j}`,
            'search_product_name': `product-${j}`,
            'product_type': 'Spirit',
            'shipping': ['Ground shipping', 'Scheduled delivery'],
            'size': ['750 mL', '375 mL', '1.75L'],
            'small_image': 'test.png',
            'tasting_notes': ['Good!'],
            'featured': (j === 0) ? 'true' : 'false',
            'delete_logo': 'delete_logo.jpg',
            'delete_favicon': 'delete_favicon.jpg',
            'price_matrix': {
                'ground_shipping': {
                    '1.75L': price,
                    '375 mL': price + 1,
                    '750 mL': price + 2
                },
                'scheduled_delivery': {
                    '1.75L': price + 3,
                    '375 mL': price + 4,
                    '750 mL': price + 5
                }
            },
            'qty': 10,
            'product_images': {
                'img_1': 's3-1.jpg',
                'img_2': '',
                'img_3': '',
                'img_4': ''
            }
        };
        products.push(testData);
    }
}

const productsNew = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const price = 37 + j;
        const testData = {
            'product_id': UUID.v4(),
            'brand_id': brands[i].brand_id,
            'ABV': '12',
            'alcohol_type': 'Spirit',
            'description': 'Dummy Product',
            'large_image': 'text.png',
            'origin': 'New york',
            'price': price,
            'product_name': `Product-${j}`,
            'search_product_name': `product-${j}`,
            'product_type': 'Spirit',
            'shipping': ['Ground shipping', 'Scheduled delivery'],
            'size': ['750 mL', '375 mL', '1.75L'],
            'small_image': 'test.png',
            'tasting_notes': ['Good!'],
            'featured': (j === 0) ? 'true' : 'false',
            'price_matrix': {
                'ground_shipping': {
                    '1.75L': price,
                    '375 mL': price + 1,
                    '750 mL': price + 2
                },
                'scheduled_delivery': {
                    '1.75L': price + 3,
                    '375 mL': price + 4,
                    '750 mL': price + 5
                }
            },
            'qty': 10,
            'product_images': {
                'img_1': 's3-1.jpg',
                'img_2': '',
                'img_3': '',
                'img_4': ''
            }
        };
        productsNew.push(testData);
    }
}

// Product Addresses Test Data
const productAddresses = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const testData = {
            'address_id': UUID.v4(),
            'brand_id': brands[i].brand_id,
            'product_id': products[j].product_id,
            'product_name': `SLI2 Product-${j}`,
            'description': 'Descriptions',
            'available_address': {
                'address_line_1': 'first',
                'country': 'US',
                'address_line_2': 'second',
                'state': 'Florida',
                'city': 'city-1',
                'zip_code': '456456'
            },
            'createdAt': new Date().getTime() + (i + j)
        };
        productAddresses.push(testData);
    }
}

const productAddressesNew = [];
for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
        const testData = {
            'address_id': UUID.v4(),
            'brand_id': brands[i].brand_id,
            'product_id': productsNew[j].product_id,
            'product_name': `SLI2 Product-${j}`,
            'description': 'Descriptions',
            'available_address': {
                'address_line_1': 'first',
                'country': 'US',
                'address_line_2': 'second',
                'state': 'Florida',
                'city': 'city-1',
                'zip_code': '456456'
            },
            'createdAt': new Date().getTime() + (i + j)
        };
        productAddressesNew.push(testData);
    }
}
const bannerText = 'Brand Announcement like promotions, important notes, etc.';
const templates = [
    {
        'template_id': '51f462ba-decb-4970-84c4-73168004ac62',
        'brand_id': brands[0].brand_id,
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'banner_background_color': '#FAFAFA',
        'banner_link': FE_URL,
        'banner_text': bannerText,
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'buy_now_button_text_color': '#FFFFFF',
        'catalog_brand_background_color': '#FFFFFF',
        'catalog_brand_sub_heading': 'Products',
        'company': 'Test Company template 1',
        'companyurl': 'http://test-company-template-1.com',
        'footer_background_color': '#FAFAFA',
        'footer_text_color': '#232323',
        'header_background_color': '#FFFFFF',
        'link_hover_color': '#8B0E04',
        'logo': 'logo.jpg',
        'logo_color': '#8B0E04',
        'policy': 'http://test1.com',
        'product_background_color': '#FFFFFF',
        'product_text_color': '#4A4A4A',
        'shopping_cart_icon_color': '#4A4A4A',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'sign_in_icon_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'template_name': 'Debut Template',
        'term_url': 'http://test1.com',
        'terms_and_policy_color': '#4A4A4A',
        'terms_and_policy_hover_color': '#8B0E04',
        'brand_awards_sub_heading': 'Brand Awards Subheading',
        'brand_awards_sub_heading_bg_color': '#FAFAFA',
        'featured_product': 'Feature Product',
        'featured_product_background_color': '#FAFAFA',
        'featured_product_id': products[0].product_id,
        'featured_product_image': 'featured_product2.jpg',
        'featured_products_description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut' +
            'labore et dolore magna aliqua.',
        'featured_products_description_text_color': '#232323',
        'product_list_button_background_color': '#8B0E04',
        'product_list_button_text_color': '#FAFAFA',
        'product_list_name_text_color': '#232323',
        'product_list_price_text_color': '#232323',
        'product_list_shipping_text_color': '#232323',
        'product_list_size_text_color': '#232323',
        'product_detail_button_background_color': '#8B0E04',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_name_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'product_detail_price_text_color': '#232323',
        'product_detail_shipping_text_color': '#232323',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_size_text_color': '#232323',
        'brand_website': FE_URL,
        'active': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
        'template_description': 'Showcase your brand and products with Debut Template, our signature template',
        'template_features': JSON.stringify([
            'Ideal for 1 to 6 products',
            'Showcase a section for a Features Product',
            'A section for awards or important achievements.'
        ])
    },
    {
        'template_id': '9ee8825e-3f63-4e62-941b-0e48ac7409ec',
        'brand_id': brands[1].brand_id,
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'banner_background_color': '#FAFAFA',
        'banner_link': FE_URL,
        'banner_text': bannerText,
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'buy_now_button_text_color': '#FFFFFF',
        'catalog_brand_background_color': '#FFFFFF',
        'catalog_brand_sub_heading': 'Products',
        'company': 'Test Company template 2',
        'companyurl': 'http://test-company-template-2.com',
        'footer_background_color': '#FAFAFA',
        'footer_text_color': '#232323',
        'header_background_color': '#FFFFFF',
        'link_hover_color': '#8B0E04',
        'logo': 'logo.jpg',
        'logo_color': '#8B0E04',
        'policy': 'http://test2.com',
        'product_background_color': '#FFFFFF',
        'product_text_color': '#4A4A4A',
        'shopping_cart_icon_color': '#4A4A4A',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'sign_in_icon_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'template_name': 'Basic Template',
        'term_url': 'http://test2.com',
        'terms_and_policy_color': '#4A4A4A',
        'terms_and_policy_hover_color': '#8B0E04',
        'check_availability_popup_subheading_text_color': '#232323',
        'check_availability_popup_text_color': '#8B0E04',
        'product_list_button_background_color': '#8B0E04',
        'product_list_button_text_color': '#FAFAFA',
        'product_list_name_text_color': '#232323',
        'product_list_price_text_color': '#232323',
        'product_list_shipping_text_color': '#232323',
        'product_list_size_text_color': '#232323',
        'product_detail_button_background_color': '#8B0E04',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_name_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'product_detail_price_text_color': '#232323',
        'product_detail_shipping_text_color': '#232323',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_size_text_color': '#232323',
        'brand_website': FE_URL,
        'active': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/2basic.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/2basic.png',
        'template_description': 'Immediately displayed you large product selection with our Basic Template',
        'template_features': JSON.stringify([
            'Ideal for 7+ products',
            'Quick Add to the Cart',
            'User friendly – Shopping Friendly'
        ])
    },
    {
        'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
        'brand_id': brands[2].brand_id,
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'banner_background_color': '#FAFAFA',
        'banner_link': FE_URL,
        'banner_text': bannerText,
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'buy_now_button_text_color': '#FFFFFF',
        'catalog_brand_background_color': '#FFFFFF',
        'catalog_brand_sub_heading': 'Products',
        'company': 'Test Company template 3',
        'companyurl': 'http://test-company-template-3.com',
        'footer_background_color': '#FAFAFA',
        'footer_text_color': '#232323',
        'header_background_color': '#FFFFFF',
        'link_hover_color': '#8B0E04',
        'logo': 'logo.jpg',
        'logo_color': '#8B0E04',
        'policy': 'http://test3.com',
        'product_background_color': '#FFFFFF',
        'product_text_color': '#4A4A4A',
        'shopping_cart_icon_color': '#4A4A4A',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'sign_in_icon_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'template_name': 'Menu Template',
        'term_url': 'http://test3.com',
        'terms_and_policy_color': '#4A4A4A',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_detail_button_background_color': '#8B0E04',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_name_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'product_detail_price_text_color': '#232323',
        'product_detail_shipping_text_color': '#232323',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_size_text_color': '#232323',
        'brand_website': FE_URL,
        'active': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/3menu.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/3menu.png',
        'template_description': 'Have a lot of products? Our Menu Template will give your customers an easy way to' +
            'navigate through them all.',
        'template_features': JSON.stringify([
            'Ideal for 7+ products',
            'Ideal for filtering and categorizing',
            'Give a lot of information of each product'
        ])
    },
    {
        'template_id': 'bc0c27ea-178e-419d-a0fa-fc0a18231697',
        'brand_id': brands[3].brand_id,
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'banner_background_color': '#FAFAFA',
        'banner_link': FE_URL,
        'banner_text': bannerText,
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'buy_now_button_text_color': '#FFFFFF',
        'catalog_brand_background_color': '#FFFFFF',
        'catalog_brand_sub_heading': 'Products',
        'company': 'Test Company template 4',
        'companyurl': 'http://test-company-template-4.com',
        'footer_background_color': '#FAFAFA',
        'footer_text_color': '#232323',
        'header_background_color': '#FFFFFF',
        'link_hover_color': '#8B0E04',
        'logo': 'logo.jpg',
        'logo_color': '#8B0E04',
        'policy': 'http://test4.com',
        'product_background_color': '#FFFFFF',
        'product_text_color': '#4A4A4A',
        'shopping_cart_icon_color': '#4A4A4A',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'sign_in_icon_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'template_name': 'Solo Template',
        'term_url': 'http://test4.com',
        'terms_and_policy_color': '#4A4A4A',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_detail_button_background_color': '#8B0E04',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_name_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'product_detail_price_text_color': '#232323',
        'product_detail_shipping_text_color': '#232323',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_size_text_color': '#232323',
        'brand_website': FE_URL,
        'active': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/4solo.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/4solo.png',
        'template_description': 'Have only 1 product? Cut the catalog page and send your users straight to the product page with' +
            'our Solo Template.',
        'template_features': JSON.stringify([
            'Ideal for 1 product',
            'Quick Add to the Cart',
            'Showcase all information in one page.'
        ])
    },
    {
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'brand_id': brands[4].brand_id,
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'banner_background_color': '#FAFAFA',
        'banner_link': FE_URL,
        'banner_text': bannerText,
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'buy_now_button_text_color': '#FFFFFF',
        'catalog_brand_background_color': '#FFFFFF',
        'catalog_brand_sub_heading': 'Products',
        'company': 'Test Company template 5',
        'companyurl': 'http://test-company-template-5.com',
        'footer_background_color': '#FAFAFA',
        'footer_text_color': '#232323',
        'header_background_color': '#FFFFFF',
        'link_hover_color': '#8B0E04',
        'logo': 'logo.jpg',
        'logo_color': '#8B0E04',
        'policy': 'http://test5.com',
        'product_background_color': '#FFFFFF',
        'product_text_color': '#4A4A4A',
        'shopping_cart_icon_color': '#4A4A4A',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'sign_in_icon_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'template_name': 'Recipe Template',
        'term_url': 'http://test5.com',
        'terms_and_policy_color': '#4A4A4A',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_detail_button_background_color': '#8B0E04',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_name_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'product_detail_price_text_color': '#232323',
        'product_detail_shipping_text_color': '#232323',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_size_text_color': '#232323',
        'product_list_button_background_color': '#8B0E04',
        'product_list_button_text_color': '#FAFAFA',
        'product_list_name_text_color': '#232323',
        'product_list_price_text_color': '#232323',
        'product_list_shipping_text_color': '#232323',
        'product_list_size_text_color': '#232323',
        'template_background': '#FAFAFA',
        'template_heading_text_color': '#232323',
        'template_subheading_text_color': '#232323',
        'template_subsection_product_text_color': '#8B0E04',
        'brand_website': FE_URL,
        'active': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/5receipe.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/5receipe.png',
        'template_description': 'Have a few products and recipes or additional information you want to share? Recipe Template is for you.',
        'template_features': JSON.stringify([
            'Ideal for 1 to 6 products',
            'Quick Add to the Cart',
            'Showcase Recipes or Product Description on Catalog Homepage'
        ])
    }
];

// Brand Recipes Test Data
const BrandRecipes = [
    {
        'recipe_id': '03499170-cf6d-11eb-9599-2d5538504def',
        'brand_id': brands[0].brand_id,
        'card_body': '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
            '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
                '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
                    '<p class="ql-align-center"><span class="ql-size-huge">BAILEYS - Dairy Free</span></p>',
        'card_image': 'https://dtc-stg-public.s3.amazonaws.com/cardimg-1623935263600.png',
        'content_section_type': 2,
        'createdAt': 1623935267847,
        'saved_card_body': '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
        '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
            '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
                '<p class="ql-align-center"><span class="ql-size-huge">BAILEYS - Dairy Free</span></p>',
        'saved_card_image': 'https://dtc-stg-public.s3.amazonaws.com/cardimg-1623935263600.png',
        'saved_content_section_type': 2,
        'saved_product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'updatedAt': 1624448525892
    }, {
        'card_image': 'https://dtc-stg-public.s3.amazonaws.com/cardimg-1623935263600.png',
        'card_body':  '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
        '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
            '<p class="ql-align-center"><br></p><p class="ql-align-center"><br></p><p class="ql-align-center"><br></p>' +
                '<p class="ql-align-center"><span class="ql-size-huge">BAILEYS - Dairy Free</span></p>',
        'content_section_type': 2,
        'brand_id': brands[0].brand_id,
        'saved_card_body': '',
        'createdAt': 1623935267847,
        'recipe_id': '0349df90-cf6d-11eb-9599-2d5538504def',
        'saved_content_section_heading': '',
        'saved_product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'saved_content_section_type': 2,
        'saved_card_image': '',
        'updatedAt': 1627654913222
    }
];

// Alcohol Type Test Data
const alcoholType = [
    {
        'id': UUID.v4(),
        'name': 'Wine',
        'order_n': 1
    },
    {
        'id': UUID.v4(),
        'name': 'Beer',
        'order_n': 2
    },
    {
        'id': UUID.v4(),
        'name': 'Gin',
        'order_n': 3
    },
    {
        'id': UUID.v4(),
        'name': 'Rum',
        'order_n': 4
    },
    {
        'id': UUID.v4(),
        'name': 'Tequila',
        'order_n': 5
    },
    {
        'id': UUID.v4(),
        'name': 'Vodka',
        'order_n': 6
    },
    {
        'id': UUID.v4(),
        'name': 'Brandy',
        'order_n': 7
    },
    {
        'id': UUID.v4(),
        'name': 'Whiskey',
        'order_n': 8
    },
    {
        'id': UUID.v4(),
        'name': 'Hard Cider',
        'order_n': 9
    },
    {
        'id': UUID.v4(),
        'name': 'Cognac',
        'order_n': 10
    }
];

// Promo code Test Data
const PromoCode = [
    {
        'promo_id': UUID.v4(),
        'promo_code': 'NEW50',
        'promo_discount': 50,
        'promo_expiry': '2023-12-25'
    },
    {
        'promo_id': UUID.v4(),
        'promo_code': 'GREB5',
        'promo_discount': 5,
        'promo_expiry': '2023-12-25'
    },
    {
        'promo_id': UUID.v4(),
        'promo_code': 'FLAT25',
        'promo_discount': 25,
        'promo_expiry': '2023-12-25'
    }
];

// Portal dummy users

const PortalUsers = [
    {
        'user_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'email': 'dcleverley0@wunderground.com',
        'first_name': 'Dominica',
        'last_name': 'Cleverley',
        'phone': '756-500-6050',
        'user_type': 'brand',
        max_product_count: 1000,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK' // test123
    }, {
        'user_id': '2d9f9b7d-51a7-494a-936d-239ef47a7169',
        'email': 'cfinlason1@apache.org',
        'first_name': 'Collin',
        'last_name': 'Finlason',
        'phone': '969-366-0582',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'lhonisch2@utexas.edu',
        'first_name': 'Luci',
        'last_name': 'Honisch',
        'phone': '945-409-9696',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'cboundey3@fema.gov',
        'first_name': 'Crystal',
        'last_name': 'Boundey',
        'phone': '837-446-1562',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'nmcvaugh4@mac.com',
        'first_name': 'Noami',
        'last_name': 'McVaugh',
        'phone': '624-504-1276',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'cmccoughan5@marketwatch.com',
        'first_name': 'Clio',
        'last_name': 'McCoughan',
        'phone': '521-753-7053',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'csabatier6@senate.gov',
        'first_name': 'Cirillo',
        'last_name': 'Sabatier',
        'phone': '941-763-3054',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'jleteve7@typepad.com',
        'first_name': 'Jessamyn',
        'last_name': 'Le Teve',
        'phone': '787-781-9130',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'cgaither8@businessweek.com',
        'first_name': 'Camilla',
        'last_name': 'Gaither',
        'phone': '105-814-2552',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'wmaccarlich9@fc2.com',
        'first_name': 'Welch',
        'last_name': 'MacCarlich',
        'phone': '827-160-8471',
        'user_type': 'brand',
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'apeasegooda@tinyurl.com',
        'first_name': 'Annmaria',
        'last_name': 'Peasegood',
        'phone': '190-924-7669',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'whullettb@wikia.com',
        'first_name': 'Wendell',
        'last_name': 'Hullett',
        'phone': '721-514-2568',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'rweightmanc@cam.ac.uk',
        'first_name': 'Rianon',
        'last_name': 'Weightman',
        'phone': '998-476-0649',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'ouddend@symantec.com',
        'first_name': 'Ogdon',
        'last_name': 'Udden',
        'phone': '536-319-7580',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'tmenezese@globo.com',
        'first_name': 'Tanitansy',
        'last_name': 'Menezes',
        'phone': '115-648-2370',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'rjirsaf@yelp.com',
        'first_name': 'Reta',
        'last_name': 'Jirsa',
        'phone': '459-659-9186',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'sscottsg@auda.org.au',
        'first_name': 'Susy',
        'last_name': 'Scotts',
        'phone': '537-961-1205',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': '08e4f5b5-47f6-4a74-b3a0-b90886813c2d',
        'email': 'aderrickh@mozilla.com',
        'first_name': 'Adelind',
        'last_name': 'Derrick',
        'phone': '540-471-2171',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'sbridgewateri@netlog.com',
        'first_name': 'Sterling',
        'last_name': 'Bridgewater',
        'phone': '491-938-9130',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }, {
        'user_id': UUID.v4(),
        'email': 'ggyppesj@walmart.com',
        'first_name': 'Georgi',
        'last_name': 'Gyppes',
        'phone': '298-283-3289',
        'user_type': 'brand',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFQB41BrXg3Quun4SrilnzLAAAAZTBjBgkqhkiG9w0BBwagVjBUA' +
            'gEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQMlMomq8Ar4LGZmXy3AgEQgCKZtoIKVLzbVyfYDRW/dVoqWAadcuCXYBppKcVR8mAYh7FK'
    }];

const RetailerPortalUsers = [
    {
        'user_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'email': 'dcleverley0_retailer@wunderground.com',
        'first_name': 'Dominica Retailer',
        'last_name': 'Cleverley',
        'phone': '756-500-6050',
        'user_type': 'retailer',
        max_product_count: 1000,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28' // test123
    }, {
        'user_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
        'email': 'cfinlason1_retailer@apache.org',
        'first_name': 'Collin Retailer',
        'last_name': 'Finlason',
        'phone': '969-366-0582',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'email': 'aderrickh_retailer@mozilla.com',
        'first_name': 'Adelind Retailer',
        'last_name': 'Derrick',
        'phone': '540-471-2171',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'cboundey3_retailer@fema.gov',
        'first_name': 'Crystal Retailer',
        'last_name': 'Boundey',
        'phone': '837-446-1562',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'nmcvaugh4_retailer@mac.com',
        'first_name': 'Noami Retailer',
        'last_name': 'McVaugh',
        'phone': '624-504-1276',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'cmccoughan5_retailer@marketwatch.com',
        'first_name': 'Clio Retailer',
        'last_name': 'McCoughan',
        'phone': '521-753-7053',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'csabatier6_retailer@senate.gov',
        'first_name': 'Cirillo Retailer',
        'last_name': 'Sabatier',
        'phone': '941-763-3054',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'jleteve7_retailer@typepad.com',
        'first_name': 'Jessamyn Retailer',
        'last_name': 'Le Teve',
        'phone': '787-781-9130',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'cgaither8_retailer@businessweek.com',
        'first_name': 'Camilla Retailer',
        'last_name': 'Gaither',
        'phone': '105-814-2552',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }, {
        'user_id': UUID.v4(),
        'email': 'wmaccarlich9_retailer@fc2.com',
        'first_name': 'Welch Retailer',
        'last_name': 'MacCarlich',
        'phone': '827-160-8471',
        'user_type': 'retailer',
        max_product_count: 3,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28'
    }
];

// Menu Test Data
const menu = [
    {
        'menu_id': 'a1f2f19a-aa38-41a5-adbc-85534bca0171',
        'menu_category': 'brand',
        'menu_name': 'Dashboard Overview',
        'menu_description': '',
        'menu_icon': 'fas fa-th-list',
        'menu_link': '/cms/dashboard-overview',
        'order_n': 1
    }, {
        'menu_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'menu_category': 'brand',
        'menu_name': 'Analytics',
        'menu_description': '',
        'menu_icon': 'fas fa-chart-area',
        'menu_link': '',
        'order_n': 2
    }, {
        'menu_id': 'bf0c4959-c0f2-4d60-a50f-b0ebd4175566',
        'menu_category': 'brand',
        'menu_name': 'Customer',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/customer',
        'parent_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'order_n': 3
    }, {
        'menu_id': 'f2409c93-9823-4303-bf99-bb0360767aaf',
        'menu_category': 'brand',
        'menu_name': 'Sales',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/analytics-sales',
        'parent_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'order_n': 4
    }, {
        'menu_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'menu_category': 'brand',
        'menu_name': 'Reports',
        'menu_description': '',
        'menu_icon': 'fas fa-file-contract',
        'menu_link': '',
        'order_n': 5
    }, {
        'menu_id': '8b104db9-c3f7-411a-bf78-ebe0a76fed35',
        'menu_category': 'brand',
        'menu_name': 'Sales',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/reports-sales',
        'parent_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'order_n': 6
    }, {
        'menu_id': '8051a7d2-8f19-48e2-8950-70142734b6bc',
        'menu_category': 'brand',
        'menu_name': 'Kpi',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/kpi',
        'parent_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'order_n': 7
    }, {
        'menu_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'menu_category': 'brand',
        'menu_name': 'Audience',
        'menu_description': '',
        'menu_icon': 'fas fa-address-card',
        'menu_link': '',
        'order_n': 8
    }, {
        'menu_id': '05b9d757-ecd9-44f5-842e-330c1ba0f2b5',
        'menu_category': 'brand',
        'menu_name': 'Profiles',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/profiles',
        'parent_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'order_n': 9
    }, {
        'menu_id': 'ced068fd-03d6-4d3c-b0d1-e47109d904a5',
        'menu_category': 'brand',
        'menu_name': 'Behaviors',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/behaviors',
        'parent_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'order_n': 10
    }, {
        'menu_id': 'fc7b21d6-b8b5-4065-9c8a-c488efaf096b',
        'menu_category': 'brand',
        'menu_name': 'Products',
        'menu_description': '',
        'menu_icon': 'fas fa-wine-bottle',
        'menu_link': '/cms/products',
        'order_n': 11
    }, {
        'menu_id': 'dec0def1-0b9c-4c16-8a04-1cd3a13c6608',
        'menu_category': 'brand',
        'menu_name': 'Orders',
        'menu_description': '',
        'menu_icon': 'fas fa-clipboard-list-check',
        'menu_link': '/cms/orders',
        'order_n': 12
    }, {
        'menu_id': 'd086ebeb-9498-492d-ad4e-6fec38b0d163',
        'menu_category': 'development',
        'menu_name': 'Online Store',
        'menu_description': '',
        'menu_icon': 'fas fa-warehouse',
        'menu_link': '/cms/online-store',
        'order_n': 13
    }
];
const brandMenu = [
    {
        'menu_id': 'a1f2f19a-aa38-41a5-adbc-85534bca0171',
        'menu_category': 'brand',
        'menu_name': 'Dashboard Overview',
        'menu_description': '',
        'menu_icon': 'fas fa-th-list',
        'menu_link': '/cms/dashboard-overview',
        'order_n': 1
    }, {
        'menu_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'menu_category': 'brand',
        'menu_name': 'Analytics',
        'menu_description': '',
        'menu_icon': 'fas fa-chart-area',
        'menu_link': '',
        'order_n': 2
    }, {
        'menu_id': 'bf0c4959-c0f2-4d60-a50f-b0ebd4175566',
        'menu_category': 'brand',
        'menu_name': 'Customer',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/customer',
        'parent_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'order_n': 3
    }, {
        'menu_id': 'f2409c93-9823-4303-bf99-bb0360767aaf',
        'menu_category': 'brand',
        'menu_name': 'Sales',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/analytics-sales',
        'parent_id': '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
        'order_n': 4
    }, {
        'menu_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'menu_category': 'brand',
        'menu_name': 'Reports',
        'menu_description': '',
        'menu_icon': 'fas fa-file-contract',
        'menu_link': '',
        'order_n': 5
    }, {
        'menu_id': '8b104db9-c3f7-411a-bf78-ebe0a76fed35',
        'menu_category': 'brand',
        'menu_name': 'Sales',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/reports-sales',
        'parent_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'order_n': 6
    }, {
        'menu_id': '8051a7d2-8f19-48e2-8950-70142734b6bc',
        'menu_category': 'brand',
        'menu_name': 'Kpi',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/kpi',
        'parent_id': '1b7f27b5-6fb0-43ef-823a-80435d59893b',
        'order_n': 7
    }, {
        'menu_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'menu_category': 'brand',
        'menu_name': 'Audience',
        'menu_description': '',
        'menu_icon': 'fas fa-address-card',
        'menu_link': '',
        'order_n': 8
    }, {
        'menu_id': '05b9d757-ecd9-44f5-842e-330c1ba0f2b5',
        'menu_category': 'brand',
        'menu_name': 'Profiles',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/profiles',
        'parent_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'order_n': 9
    }, {
        'menu_id': 'ced068fd-03d6-4d3c-b0d1-e47109d904a5',
        'menu_category': 'brand',
        'menu_name': 'Behaviors',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/behaviors',
        'parent_id': 'a39a3073-6633-41b3-b174-e7b803e02eb6',
        'order_n': 10
    }, {
        'menu_id': 'fc7b21d6-b8b5-4065-9c8a-c488efaf096b',
        'menu_category': 'brand',
        'menu_name': 'Products',
        'menu_description': '',
        'menu_icon': 'fas fa-wine-bottle',
        'menu_link': '/cms/products',
        'order_n': 11
    }, {
        'menu_id': 'dec0def1-0b9c-4c16-8a04-1cd3a13c6608',
        'menu_category': 'brand',
        'menu_name': 'Orders',
        'menu_description': '',
        'menu_icon': 'fas fa-clipboard-list-check',
        'menu_link': '/cms/orders',
        'order_n': 12
    }
];

const developmentMenu = [
    {
        'menu_id': 'd086ebeb-9498-492d-ad4e-6fec38b0d163',
        'menu_category': 'development',
        'menu_name': 'Online Store',
        'menu_description': '',
        'menu_icon': 'fas fa-warehouse',
        'menu_link': '/cms/online-store',
        'order_n': 13
    }
];

// Menu Permissions Test Data
const MenuPermissions = [
    {
        'id': UUID.v4(),
        'user_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'menu_items': menu
    },
    {
        'id': UUID.v4(),
        'user_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'menu_items': menu
    },
    {
        'id': UUID.v4(),
        'user_id': '08e4f5b5-47f6-4a74-b3a0-b90886813c2d',
        'menu_items': brandMenu
    },
    {
        'id': UUID.v4(),
        'user_id': '2d9f9b7d-51a7-494a-936d-239ef47a7169',
        'menu_items': developmentMenu
    }
];

const TemplateMaster = [
    {
        'product_list_button_text_color': '#FAFAFA',
        'product_text_color': '#4A4A4A',
        'banner_link': FE_URL,
        'product_list_shipping_text_color': '#232323',
        'shopping_cart_icon_color': '#4A4A4A',
        'brand_awards_sub_heading_bg_color': '#FAFAFA',
        'footer_background_color': '#FAFAFA',
        'product_detail_size_text_color': '#232323',
        'buy_now_button_text_color': '#FFFFFF',
        'brand_website': FE_URL,
        'policy': 'http://test.com',
        'product_list_size_text_color': '#232323',
        'banner_background_color': '#FAFAFA',
        'featured_product_background_color': '#FAFAFA',
        'logo_color': '#8B0E04',
        'footer_text_color': '#232323',
        'product_detail_name_text_color': '#232323',
        'product_list_button_background_color': '#8B0E04',
        'banner_text': 'Brand Announcement like promotions, important notes, etc.',
        'catalog_brand_background_color': '#FFFFFF',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_button_text_color': '#FAFAFA',
        'featured_product': 'Feature Product',
        'product_detail_button_background_color': '#8B0E04',
        'link_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'sign_in_icon_color': '#4A4A4A',
        'brand_name': 'brand-1',
        'term_url': 'http://test.com',
        'companyurl': 'http://test-company.com',
        'product_detail_price_text_color': '#232323',
        'terms_and_policy_color': '#4A4A4A',
        'product_list_name_text_color': '#232323',
        'template_name': 'Debut Template',
        'company': 'Test Company',
        'header_background_color': '#FFFFFF',
        'back_to_main_page_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'back_to_main_page_hover_color': '#8B0E04',
        'product_detail_shipping_text_color': '#232323',
        'catalog_brand_sub_heading': 'Products',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'product_detail_type_text_color': '#232323',
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'logo': 'logo.jpg',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_list_price_text_color': '#232323',
        'template_id': '51f462ba-decb-4970-84c4-73168004ac62',
        'product_background_color': '#FFFFFF',
        'featured_products_description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'brand_awards_sub_heading': 'Brand Awards Subheading',
        'featured_product_id': '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
        'is_default': true,
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
        'template_description': 'Showcase your brand and products with Debut Template, our signature template',
        'template_features': JSON.stringify([
            'Ideal for 1 to 6 products',
            'Showcase a section for a Features Product',
            'A section for awards or important achievements.'
        ])
    },
    {
        'product_list_button_text_color': '#FAFAFA',
        'product_text_color': '#4A4A4A',
        'banner_link': FE_URL,
        'product_list_shipping_text_color': '#232323',
        'shopping_cart_icon_color': '#4A4A4A',
        'footer_background_color': '#FAFAFA',
        'product_detail_size_text_color': '#232323',
        'buy_now_button_text_color': '#FFFFFF',
        'brand_website': FE_URL,
        'policy': 'http://test.com',
        'product_list_size_text_color': '#232323',
        'banner_background_color': '#FAFAFA',
        'logo_color': '#8B0E04',
        'footer_text_color': '#232323',
        'product_detail_name_text_color': '#232323',
        'product_list_button_background_color': '#8B0E04',
        'banner_text': 'Brand Announcement like promotions, important notes, etc.',
        'catalog_brand_background_color': '#FFFFFF',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_button_background_color': '#8B0E04',
        'link_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'sign_in_icon_color': '#4A4A4A',
        'brand_name': 'brand-2',
        'term_url': 'http://test.com',
        'companyurl': 'http://test-company.com',
        'product_detail_price_text_color': '#232323',
        'terms_and_policy_color': '#4A4A4A',
        'product_list_name_text_color': '#232323',
        'check_availability_popup_text_color': '#8B0E04',
        'template_name': 'Basic Template',
        'company': 'Test Company',
        'header_background_color': '#FFFFFF',
        'back_to_main_page_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'back_to_main_page_hover_color': '#8B0E04',
        'product_detail_shipping_text_color': '#232323',
        'catalog_brand_sub_heading': 'Products',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'check_availability_popup_subheading_text_color': '#232323',
        'product_detail_type_text_color': '#232323',
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'logo': 'logo.jpg',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_list_price_text_color': '#232323',
        'template_id': '9ee8825e-3f63-4e62-941b-0e48ac7409ec',
        'product_background_color': '#FFFFFF',
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/2basic.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/2basic.png',
        'template_description': 'Immediately displayed you large product selection with our Basic Template',
        'template_features': JSON.stringify([
            'Ideal for 7+ products',
            'Quick Add to the Cart',
            'User friendly – Shopping Friendly'
        ])
    },
    {
        'product_detail_button_text_color': '#FAFAFA',
        'featured_product': 'Feature Product',
        'product_text_color': '#4A4A4A',
        'product_detail_button_background_color': '#8B0E04',
        'link_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'sign_in_icon_color': '#4A4A4A',
        'brand_name': 'brand-3',
        'term_url': 'http://test.com',
        'banner_link': FE_URL,
        'shopping_cart_icon_color': '#4A4A4A',
        'companyurl': 'http://test-company.com',
        'product_detail_price_text_color': '#232323',
        'terms_and_policy_color': '#4A4A4A',
        'template_name': 'Menu Template',
        'footer_background_color': '#FAFAFA',
        'company': 'Test Company',
        'header_background_color': '#FFFFFF',
        'product_detail_size_text_color': '#232323',
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'sign_in_icon_hover_color': '#8B0E04',
        'product_detail_shipping_text_color': '#232323',
        'buy_now_button_text_color': '#FFFFFF',
        'brand_website': FE_URL,
        'policy': 'http://test.com',
        'catalog_brand_sub_heading': 'Products',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'product_detail_type_text_color': '#232323',
        'banner_background_color': '#FAFAFA',
        'featured_products_description_text_color': '#232323',
        'featured_product_background_color': '#FAFAFA',
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'footer_text_color': '#232323',
        'logo_color': '#8B0E04',
        'logo': 'logo.jpg',
        'product_detail_name_text_color': '#232323',
        'terms_and_policy_hover_color': '#8B0E04',
        'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
        'product_background_color': '#FFFFFF',
        'banner_text': 'Brand Announcement like promotions, important notes, etc.',
        'featured_products_description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'featured_product_image': 'featured_product2.jpg',
        'catalog_brand_background_color': '#FFFFFF',
        'featured_product_id': 'fb65a6a8-0348-4936-91db-d86ce7d1723c',
        'product_detail_quantity_text_color': '#232323',
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/3menu.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/3menu.png',
        'template_description': 'Have a lot of products? Our Menu Template will give your customers an easy way to' +
            'navigate through them all.',
        'template_features': JSON.stringify([
            'Ideal for 7+ products',
            'Ideal for filtering and categorizing',
            'Give a lot of information of each product'
        ])
    },
    {
        'product_detail_button_text_color': '#FAFAFA',
        'product_text_color': '#4A4A4A',
        'product_detail_button_background_color': '#8B0E04',
        'link_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'sign_in_icon_color': '#4A4A4A',
        'brand_name': 'brand-4',
        'term_url': 'http://test.com',
        'banner_link': FE_URL,
        'shopping_cart_icon_color': '#4A4A4A',
        'companyurl': 'http://test-company.com',
        'product_detail_price_text_color': '#232323',
        'terms_and_policy_color': '#4A4A4A',
        'template_name': 'Solo Template',
        'footer_background_color': '#FAFAFA',
        'company': 'Test Company',
        'header_background_color': '#FFFFFF',
        'product_detail_size_text_color': '#232323',
        'back_to_main_page_color': '#4A4A4A',
        'back_to_main_page_hover_color': '#8B0E04',
        'sign_in_icon_hover_color': '#8B0E04',
        'product_detail_shipping_text_color': '#232323',
        'buy_now_button_text_color': '#FFFFFF',
        'brand_website': FE_URL,
        'policy': 'http://test.com',
        'catalog_brand_sub_heading': 'Products',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'product_detail_type_text_color': '#232323',
        'banner_background_color': '#FAFAFA',
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'footer_text_color': '#232323',
        'logo_color': '#8B0E04',
        'logo': 'logo.jpg',
        'product_detail_name_text_color': '#232323',
        'terms_and_policy_hover_color': '#8B0E04',
        'template_id': 'bc0c27ea-178e-419d-a0fa-fc0a18231697',
        'product_background_color': '#FFFFFF',
        'banner_text': 'Brand Announcement like promotions, important notes, etc.',
        'catalog_brand_background_color': '#FFFFFF',
        'product_detail_quantity_text_color': '#232323',
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/4solo.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/4solo.png',
        'template_description': 'Have only 1 product? Cut the catalog page and send your users straight to the product page with' +
            'our Solo Template. ',
        'template_features': JSON.stringify([
            'Ideal for 1 product',
            'Quick Add to the Cart',
            'Showcase all information in one page.'
        ])
    },
    {
        'product_list_button_text_color': '#FAFAFA',
        'template_subsection_product_text_color': '#8B0E04',
        'product_text_color': '#4A4A4A',
        'banner_link': FE_URL,
        'product_list_shipping_text_color': '#232323',
        'shopping_cart_icon_color': '#4A4A4A',
        'footer_background_color': '#FAFAFA',
        'product_detail_size_text_color': '#232323',
        'template_subheading_text_color': '#232323',
        'buy_now_button_text_color': '#FFFFFF',
        'brand_website': FE_URL,
        'policy': 'http://test.com',
        'product_list_size_text_color': '#232323',
        'banner_background_color': '#FAFAFA',
        'logo_color': '#8B0E04',
        'footer_text_color': '#232323',
        'product_detail_name_text_color': '#232323',
        'product_list_button_background_color': '#8B0E04',
        'banner_text': 'Brand Announcement like promotions, important notes, etc.',
        'template_heading_text_color': '#232323',
        'catalog_brand_background_color': '#FFFFFF',
        'product_detail_quantity_text_color': '#232323',
        'product_detail_button_text_color': '#FAFAFA',
        'product_detail_button_background_color': '#8B0E04',
        'link_hover_color': '#8B0E04',
        'back_to_main_page_url': FE_URL,
        'sign_in_icon_color': '#4A4A4A',
        'brand_name': 'brand-5',
        'term_url': 'http://test.com',
        'companyurl': 'http://test-company.com',
        'product_detail_price_text_color': '#232323',
        'terms_and_policy_color': '#4A4A4A',
        'product_list_name_text_color': '#232323',
        'template_name': 'Recipe Template',
        'company': 'Test Company',
        'header_background_color': '#FFFFFF',
        'back_to_main_page_color': '#4A4A4A',
        'sign_in_icon_hover_color': '#8B0E04',
        'back_to_main_page_hover_color': '#8B0E04',
        'product_detail_shipping_text_color': '#232323',
        'catalog_brand_sub_heading': 'Products',
        'shopping_cart_icon_hover_color': '#8B0E04',
        'product_detail_type_text_color': '#232323',
        'banner_text_color': '#000000',
        'buy_now_button_color': '#8B0E04',
        'logo': 'logo.jpg',
        'terms_and_policy_hover_color': '#8B0E04',
        'product_list_price_text_color': '#232323',
        'template_id': 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
        'product_background_color': '#FFFFFF',
        'template_background': '#FAFAFA',
        'logo_alt_text': 'logo',
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#232323',
            'body_text': '#232323'
        },
        'color_button': {
            'background': '#8B0E04',
            'text': '#FFFFFF',
            'border': '#8B0E04'
        },
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'color_annoucement_bar': {
            'bar': '#FAFAFA',
            'text': '#232323'
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/5receipe.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/5receipe.png',
        'template_description': 'Have a few products and recipes or additional information you want to share? Recipe Template is for you.',
        'template_features': JSON.stringify([
            'Ideal for 1 to 6 products',
            'Quick Add to the Cart',
            'Showcase Recipes or Product Description on Catalog Homepage'
        ])
    }
];

const RetailerMenu = [
    {
        'menu_id': '83b0b4ed-48b2-440a-b7bc-7611a72fb651',
        'menu_category': 'retailer',
        'menu_name': 'Dashboard Overview',
        'menu_description': '',
        'menu_icon': 'fas fa-th-list',
        'menu_link': '/cms/dashboard-overview',
        'order_n': 1
    },
    {
        'menu_id': '6460b19b-6880-4db0-bb3d-2c15e9d582b7',
        'menu_category': 'retailer',
        'menu_name': 'Order Management',
        'menu_description': '',
        'menu_icon': 'fas fa-boxes',
        'menu_link': '/cms/orders',
        'order_n': 2
    },
    {
        'menu_id': '12ae52da-5c2a-4af2-ba14-47002ef79fcd',
        'menu_category': 'retailer',
        'menu_name': 'Product Management',
        'menu_description': '',
        'menu_icon': 'fas fa-wine-bottle',
        'menu_link': '',
        'order_n': 3
    },
    {
        'menu_id': '0fc2a4a3-7d16-4ac9-b70d-0d033faaad42',
        'menu_category': 'retailer',
        'menu_name': 'Product Inventory',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/products',
        'parent_id': '12ae52da-5c2a-4af2-ba14-47002ef79fcd',
        'order_n': 4
    },
    {
        'menu_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'menu_category': 'retailer',
        'menu_name': 'Additional Prices',
        'menu_description': '',
        'menu_icon': 'fas fa-dollar-sign',
        'menu_link': '',
        'order_n': 5
    },
    {
        'menu_id': '5ddd0a95-53d1-47b6-b226-0e3ea71e8170',
        'menu_category': 'retailer',
        'menu_name': 'Shipping Rates',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/shipping-rates',
        'parent_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'order_n': 6
    },
    {
        'menu_id': 'a4c2f041-0d28-4bf3-8a49-bfbf8e748aaa',
        'menu_category': 'retailer',
        'menu_name': 'Transaction History',
        'menu_description': '',
        'menu_icon': '',
        'menu_link': '/cms/transaction-history',
        'parent_id': '55ad6709-6de8-4302-93e0-5dab68f700ea',
        'order_n': 7
    }
];

const RetailerMenuPermissions = [
    {
        'id': UUID.v4(),
        'user_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'menu_items': RetailerMenu
    },
    {
        'id': UUID.v4(),
        'user_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
        'menu_items': RetailerMenu
    },
    {
        'id': UUID.v4(),
        'user_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'menu_items': RetailerMenu
    }
];

// Order Status Test Data
const OrderStatus = [
    {
        'id': UUID.v4(),
        'name': 'Pending',
        'order_n': 1
    },
    {
        'id': UUID.v4(),
        'name': 'Received',
        'order_n': 2
    },
    {
        'id': UUID.v4(),
        'name': 'Shipped',
        'order_n': 3
    },
    {
        'id': UUID.v4(),
        'name': 'Delivered',
        'order_n': 4
    },
    {
        'id': UUID.v4(),
        'name': 'Cancelled',
        'order_n': 5
    }
];

const Roles = [
    {
        role_id: UUID.v4(),
        role_name: 'Administrator',
        role_desc: 'Access to all features in the portal including managing user roles.',
        order_n: 1,
        role_menu: [
            {
                menu_id: '05b9d757-ecd9-44f5-842e-330c1ba0f2b5',
                menu_name: 'Profiles'
            }, {
                menu_id: '1b7f27b5-6fb0-43ef-823a-80435d59893b',
                menu_name: 'Reports'
            }, {
                menu_id: '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
                menu_name: 'Analytics'
            }, {
                menu_id: '8051a7d2-8f19-48e2-8950-70142734b6bc',
                menu_name: 'Kpi'
            }, {
                menu_id: '8b104db9-c3f7-411a-bf78-ebe0a76fed35',
                menu_name: 'Sales'
            }, {
                menu_id: 'a1f2f19a-aa38-41a5-adbc-85534bca0171',
                menu_name: 'Dashboard Overview'
            }, {
                menu_id: 'a39a3073-6633-41b3-b174-e7b803e02eb6',
                menu_name: 'Audience'
            }, {
                menu_id: 'bf0c4959-c0f2-4d60-a50f-b0ebd4175566',
                menu_name: 'Customer'
            }, {
                menu_id: 'ced068fd-03d6-4d3c-b0d1-e47109d904a5',
                menu_name: 'Behaviors'
            }, {
                menu_id: 'dec0def1-0b9c-4c16-8a04-1cd3a13c6608',
                menu_name: 'Orders'
            }, {
                menu_id: 'f2409c93-9823-4303-bf99-bb0360767aaf',
                menu_name: 'Sales'
            }, {
                menu_id: 'fc7b21d6-b8b5-4065-9c8a-c488efaf096b',
                menu_name: 'Products'
            }, {
                menu_id: 'd086ebeb-9498-492d-ad4e-6fec38b0d163',
                menu_name: 'Online Store'// development menu category
            }, {
                menu_id: '295dcf49-8091-45fe-bd75-6567a1f8fef5',
                menu_name: 'Domain'
            }, {
                menu_id: '5d6c3d5e-84c6-44be-929b-0f9b7e2c8d5d',
                menu_name: 'Roles'
            }, {
                menu_id: 'b633c2d4-6783-48ba-9c77-fa451b70bc19',
                menu_name: 'Account'
            }, {
                menu_id: '1f73fa19-fc6c-4c88-ac51-44c052f3b636',
                menu_name: 'Log Out'
            }
        ]
    }, {
        role_id: UUID.v4(),
        role_name: 'Manager',
        role_desc: 'Access to both brand and developer menu but cannot manage users.',
        order_n: 2,
        role_menu: [
            {
                menu_id: '05b9d757-ecd9-44f5-842e-330c1ba0f2b5',
                menu_name: 'Profiles'
            }, {
                menu_id: '1b7f27b5-6fb0-43ef-823a-80435d59893b',
                menu_name: 'Reports'
            }, {
                menu_id: '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
                menu_name: 'Analytics'
            }, {
                menu_id: '8051a7d2-8f19-48e2-8950-70142734b6bc',
                menu_name: 'Kpi'
            }, {
                menu_id: '8b104db9-c3f7-411a-bf78-ebe0a76fed35',
                menu_name: 'Sales'
            }, {
                menu_id: 'a1f2f19a-aa38-41a5-adbc-85534bca0171',
                menu_name: 'Dashboard Overview'
            }, {
                menu_id: 'a39a3073-6633-41b3-b174-e7b803e02eb6',
                menu_name: 'Audience'
            }, {
                menu_id: 'bf0c4959-c0f2-4d60-a50f-b0ebd4175566',
                menu_name: 'Customer'
            }, {
                menu_id: 'ced068fd-03d6-4d3c-b0d1-e47109d904a5',
                menu_name: 'Behaviors'
            }, {
                menu_id: 'dec0def1-0b9c-4c16-8a04-1cd3a13c6608',
                menu_name: 'Orders'
            }, {
                menu_id: 'f2409c93-9823-4303-bf99-bb0360767aaf',
                menu_name: 'Sales'
            }, {
                menu_id: 'fc7b21d6-b8b5-4065-9c8a-c488efaf096b',
                menu_name: 'Products'
            }, {
                menu_id: 'd086ebeb-9498-492d-ad4e-6fec38b0d163',
                menu_name: 'Online Store'// development menu category
            }, {
                menu_id: 'b633c2d4-6783-48ba-9c77-fa451b70bc19',
                menu_name: 'Account'
            }, {
                menu_id: '1f73fa19-fc6c-4c88-ac51-44c052f3b636',
                menu_name: 'Log Out'
            }
        ]
    }, {
        role_id: UUID.v4(),
        role_name: 'Information',
        role_desc: 'Access to Analytics and Order Management System.',
        order_n: 3,
        role_menu: [
            {
                menu_id: '7e6f7dcb-fdf3-4991-ad1b-40d2685d5e5a',
                menu_name: 'Analytics'
            }, {
                menu_id: 'dec0def1-0b9c-4c16-8a04-1cd3a13c6608',
                menu_name: 'Orders'
            }, {
                menu_id: 'b633c2d4-6783-48ba-9c77-fa451b70bc19',
                menu_name: 'Account'
            }, {
                menu_id: '1f73fa19-fc6c-4c88-ac51-44c052f3b636',
                menu_name: 'Log Out'
            }
        ]
    }, {
        role_id: UUID.v4(),
        role_name: 'Developer',
        role_desc: 'Access to Developer Menu and Product Management System.',
        order_n: 4,
        role_menu: [
            {
                menu_id: 'd086ebeb-9498-492d-ad4e-6fec38b0d163',
                menu_name: 'Online Store'// development menu category
            }, {
                menu_id: 'fc7b21d6-b8b5-4065-9c8a-c488efaf096b',
                menu_name: 'Products'
            }, {
                menu_id: 'b633c2d4-6783-48ba-9c77-fa451b70bc19',
                menu_name: 'Account'
            }, {
                menu_id: '1f73fa19-fc6c-4c88-ac51-44c052f3b636',
                menu_name: 'Log Out'
            }
        ]
    }
];

const BrandProfileMenu = [{
    'menu_id': 'b633c2d4-6783-48ba-9c77-fa451b70bc19',
    'menu_category': 'brand_profile_menu',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/brand/account',
    'menu_name': 'Account',
    'order_n': 1
},
{
    'menu_id': '295dcf49-8091-45fe-bd75-6567a1f8fef5',
    'menu_category': 'brand_profile_menu',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/brand/domain',
    'menu_name': 'Domain',
    'order_n': 2
},
{
    'menu_id': '5d6c3d5e-84c6-44be-929b-0f9b7e2c8d5d',
    'menu_category': 'brand_profile_menu',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/brand/roles',
    'menu_name': 'Roles',
    'order_n': 3
},
{
    'menu_id': 'ae19cb4e-1d86-4ca4-b493-8a9fa794cd24',
    'menu_category': 'brand_profile_menu',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/brand/fulfillment-preference',
    'menu_name': 'Fulfillment Preference',
    'order_n': 4
},
{
    'menu_id': '1f73fa19-fc6c-4c88-ac51-44c052f3b636',
    'menu_category': 'brand_profile_menu',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/portal',
    'menu_name': 'Log Out',
    'order_n': 5
}];

const marketsPart1 = [
    { 'id': '1', 'name': 'Alaska', 'code': 'AK', 'time_zone': 'America\/Anchorage' },
    { 'id': '2', 'name': 'Alabama', 'code': 'AL', 'time_zone': 'America\/Chicago' },
    { 'id': '3', 'name': 'Arkansas', 'code': 'AR', 'time_zone': 'America\/Chicago' },
    { 'id': '4', 'name': 'Arizona', 'code': 'AZ', 'time_zone': 'America\/Denver' },
    { 'id': '5', 'name': 'California', 'code': 'CA', 'time_zone': 'America\/Los_Angeles' },
    { 'id': '6', 'name': 'Colorado', 'code': 'CO', 'time_zone': 'America\/Denver' },
    { 'id': '7', 'name': 'Connecticut', 'code': 'CT', 'time_zone': 'America\/New_York' },
    { 'id': '8', 'name': 'District of Columbia', 'code': 'DC', 'time_zone': 'America\/New_York' },
    { 'id': '9', 'name': 'Delaware', 'code': 'DE', 'time_zone': 'America\/New_York' },
    { 'id': '10', 'name': 'Florida', 'code': 'FL', 'time_zone': 'America\/New_York' },
    { 'id': '11', 'name': 'Georgia', 'code': 'GA', 'time_zone': 'America\/New_York' },
    { 'id': '12', 'name': 'Hawaii', 'code': 'HI', 'time_zone': 'America\/Adak' },
    { 'id': '13', 'name': 'Iowa', 'code': 'IA', 'time_zone': 'America\/Chicago' },
    { 'id': '14', 'name': 'Idaho', 'code': 'ID', 'time_zone': 'America\/Denver' },
    { 'id': '15', 'name': 'Illinois', 'code': 'IL', 'time_zone': 'America\/Chicago' },
    { 'id': '16', 'name': 'Indiana', 'code': 'IN', 'time_zone': 'America\/New_York' },
    { 'id': '17', 'name': 'Kansas', 'code': 'KS', 'time_zone': 'America\/Chicago' },
    { 'id': '18', 'name': 'Kentucky', 'code': 'KY', 'time_zone': 'America\/New_York' },
    { 'id': '19', 'name': 'Louisiana', 'code': 'LA', 'time_zone': 'America\/Chicago' },
    { 'id': '20', 'name': 'Massachusetts', 'code': 'MA', 'time_zone': 'America\/New_York' },
    { 'id': '21', 'name': 'Maryland', 'code': 'MD', 'time_zone': 'America\/New_York' },
    { 'id': '22', 'name': 'Maine', 'code': 'ME', 'time_zone': 'America\/New_York' },
    { 'id': '23', 'name': 'Michigan', 'code': 'MI', 'time_zone': 'America\/New_York' },
    { 'id': '24', 'name': 'Minnesota', 'code': 'MN', 'time_zone': 'America\/Chicago' }
];

const marketsPart2 = [
    { 'id': '25', 'name': 'Missouri', 'code': 'MO', 'time_zone': 'America\/Chicago' },
    { 'id': '26', 'name': 'Mississippi', 'code': 'MS', 'time_zone': 'America\/Chicago' },
    { 'id': '27', 'name': 'Montana', 'code': 'MT', 'time_zone': 'America\/Denver' },
    { 'id': '28', 'name': 'North Carolina', 'code': 'NC', 'time_zone': 'America\/New_York' },
    { 'id': '29', 'name': 'North Dakota', 'code': 'ND', 'time_zone': 'America\/Chicago' },
    { 'id': '30', 'name': 'Nebraska', 'code': 'NE', 'time_zone': 'America\/Chicago' },
    { 'id': '31', 'name': 'New Hampshire', 'code': 'NH', 'time_zone': 'America\/New_York' },
    { 'id': '32', 'name': 'New Jersey', 'code': 'NJ', 'time_zone': 'America\/New_York' },
    { 'id': '33', 'name': 'New Mexico', 'code': 'NM', 'time_zone': 'America\/Denver' },
    { 'id': '34', 'name': 'Nevada', 'code': 'NV', 'time_zone': 'America\/Los_Angeles' },
    { 'id': '35', 'name': 'New York', 'code': 'NY', 'time_zone': 'America\/New_York' },
    { 'id': '36', 'name': 'Ohio', 'code': 'OH', 'time_zone': 'America\/New_York' },
    { 'id': '37', 'name': 'Oklahoma', 'code': 'OK', 'time_zone': 'America\/Chicago' },
    { 'id': '38', 'name': 'Oregon', 'code': 'OR', 'time_zone': 'America\/Los_Angeles' },
    { 'id': '39', 'name': 'Pennsylvania', 'code': 'PA', 'time_zone': 'America\/New_York' },
    { 'id': '40', 'name': 'Rhode Island', 'code': 'RI', 'time_zone': 'America\/New_York' },
    { 'id': '41', 'name': 'South Carolina', 'code': 'SC', 'time_zone': 'America\/New_York' },
    { 'id': '42', 'name': 'South Dakota', 'code': 'SD', 'time_zone': 'America\/Chicago' },
    { 'id': '43', 'name': 'Tennessee', 'code': 'TN', 'time_zone': 'America\/Chicago' },
    { 'id': '44', 'name': 'Texas', 'code': 'TX', 'time_zone': 'America\/Chicago' },
    { 'id': '45', 'name': 'Utah', 'code': 'UT', 'time_zone': 'America\/Denver' },
    { 'id': '46', 'name': 'Virginia', 'code': 'VA', 'time_zone': 'America\/New_York' },
    { 'id': '47', 'name': 'Vermont', 'code': 'VT', 'time_zone': 'America\/New_York' },
    { 'id': '48', 'name': 'Washington', 'code': 'WA', 'time_zone': 'America\/Los_Angeles' },
    { 'id': '49', 'name': 'Wisconsin', 'code': 'WI', 'time_zone': 'America\/Chicago' }
];
const marketsPart3 = [
    { 'id': '50', 'name': 'West Virginia', 'code': 'WV', 'time_zone': 'America\/New_York' },
    { 'id': '51', 'name': 'Wyoming', 'code': 'WY', 'time_zone': 'America\/Denver' },
    { 'id': '60', 'name': 'Montgomery Co.', 'code': 'MON', 'time_zone': 'America\/Chicago' },
    { 'id': '61', 'name': 'National (U.S.)', 'code': 'U.S', 'time_zone': 'America\/New_York' },
    { 'id': '101', 'name': 'American Samoa', 'code': 'AS', 'time_zone': 'Pacific\/Apia' },
    { 'id': '102', 'name': 'Federated States of Micronesia', 'code': 'FM', 'time_zone': '' },
    { 'id': '103', 'name': 'Guam', 'code': 'GU', 'time_zone': 'Pacific\/Guam' },
    { 'id': '104', 'name': 'Marshall Islands', 'code': 'MH', 'time_zone': 'Pacific\/Fiji' },
    { 'id': '105', 'name': 'Northern Mariana Islands', 'code': 'MP', 'time_zone': 'Pacific\/Guam' },
    { 'id': '106', 'name': 'Palau', 'code': 'PW', 'time_zone': 'Atlantic\/Azores' },
    { 'id': '107', 'name': 'Puerto Rico', 'code': 'PR', 'time_zone': '' },
    { 'id': '108', 'name': 'Virgin Islands', 'code': 'VI', 'time_zone': 'Atlantic\/Azores' }
];
const FulfillmentPortalUsers = [
    {
        'user_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'email': 'dcleverley0_fulfillment@wunderground.com',
        'first_name': 'Dominica Fulfillment',
        'last_name': 'Cleverley',
        'phone': '756-500-6050',
        'user_type': 'fulfillment_center',
        'max_product_count': 1000,
        'date_of_birth': new Date().getTime(),
        'password': 'AQICAHjnJLbvg1v4VniTygAySJo1g6myFmJI/doCJSZQyJNYiQHdxpBo2aBHscG+XBJdsRdGAAAAZTBjBgkqhkiG9w0BBwagVjBUAgEAME8GCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM2B1t8VU/eh/1FOIvAgEQgCIC+ZG3dbmIaGG1DuzWyHRD3vyHjQE2UIXe7vehCJPnxq28' // test123
    }
];

const FulfillmentCenters = [
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'primary_address': {
            'zipcode': '33131',
            'lng': '-80.191720',
            'city': 'Miami',
            'address_line_1': '1000 Brickell Ave',
            'address_line_2': '',
            'state': 'Florida',
            'lat': '25.763940'
        },
        'primary_email_address': 'orders@brand.parkstreet.com',
        'shipping_zone_rates': [
            {
                'name': 'zone-1',
                'rate': 125,
                'states': [
                    {
                        'name': 'Alabama',
                        'id': '2'
                    },
                    {
                        'name': 'Delaware',
                        'id': '9'
                    }
                ]
            },
            {
                'name': 'zone-2',
                'rate': 200,
                'states': [
                    {
                        'name': 'Colorado',
                        'id': '6'
                    },
                    {
                        'name': 'Connecticut',
                        'id': '7'
                    }
                ]
            }
        ],
        'fulfillment_center_name': 'Park Street Fulfillment Center',
        'primary_contact_number': '',
        'is_fulfillment_center': true
    }
];

// Fulfillment Center Menu Test Data
const FulfillmentCenterMenu = [ {
    'menu_id': '98af4037-2a58-4248-a128-fcded148ac64',
    'menu_category': 'brand',
    'menu_name': 'Fulfillment Center',
    'menu_description': '',
    'menu_icon': 'fas fa-dolly',
    'menu_link': '',
    'order_n': 14
}, {
    'menu_id': '9cce1c56-35ea-4b8c-b1e1-2448732df378',
    'menu_category': 'brand',
    'menu_name': 'Zones & Rates',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/zones-rates',
    'parent_id': '98af4037-2a58-4248-a128-fcded148ac64',
    'order_n': 15
}, {
    'menu_id': 'bbc8593b-69a2-4e3a-8b6b-c1ab77d60263',
    'menu_category': 'brand',
    'menu_name': 'Inventory',
    'menu_description': '',
    'menu_icon': '',
    'menu_link': '/cms/inventory',
    'parent_id': '98af4037-2a58-4248-a128-fcded148ac64',
    'order_n': 16
}];

// Fulfillment Product Test Data
const FulfillmentProducts = [
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '94e47093-24c8-4661-aa4e-6735dfd74a59',
        'search_product_name': 'product-161',
        'product_name': 'Product-161',
        'product_status': 1,
        'alcohol_type': 'Beer',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '58.58',
        'updatedAt': 1630412276557,
        'sizeVariantList': [
            {
                'upc_code': 555,
                'sku_code': '1567',
                'variant_size': 55,
                'variant_id': '409f7160-0bf9-4be7-8092-825b0b0a87ff',
                'variant_type': 'ml',
                'product_id': '099b64e0-9142-11eb-8bab-f5e971587f15'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1617099811484.jpg'
        },
        'description': '<font face="Arial">SV-test-8</font>',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
        'search_product_name': 'product-162',
        'product_name': 'Product-162',
        'product_status': 1,
        'alcohol_type': 'Gin',
        'variants_count': 2,
        'is_catalog_product': true,
        'removed_images': [],
        'ABV': '1278',
        'updatedAt': 1630412276398,
        'sizeVariantList': [
            {
                'upc_code': 7888,
                'sku_code': '113',
                'variant_size': 12,
                'variant_type': 'ml'
            },
            {
                'upc_code': 878888,
                'sku_code': '1113',
                'variant_size': 99,
                'variant_type': 'ml'
            }
        ],
        'product_images': {
            'img_1': 'product-1616756200312.jpg'
        },
        'description': 'Testing',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
        'search_product_name': 'product-163',
        'product_name': 'Product-163',
        'product_status': 1,
        'description': 'Testing',
        'alcohol_type': 'Rum',
        'variants_count': 1,
        'is_catalog_product': true,
        'removed_images': [],
        'ABV': '12',
        'sizeVariantList': [
            {
                'upc_code': 1,
                'variant': '12 ml',
                'variant_size': 12,
                'sku_code': '123',
                'variant_type': 'ml'
            }
        ],
        'product_images': {
            'img_1': 'product-1633013533057.jpg'
        },
        'availability_count': 0
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '1643cafd-ee40-4462-adc0-d49a5e3610e8',
        'search_product_name': 'product-164',
        'product_name': 'Product-164',
        'product_status': 1,
        'alcohol_type': 'Tequila',
        'variants_count': 1,
        'is_catalog_product': true,
        'removed_images': [],
        'ABV': '12',
        'updatedAt': 1630412278298,
        'sizeVariantList': [
            {
                'upc_code': 7899,
                'sku_code': '1234',
                'variant_size': 13,
                'variant_type': 'ml'
            }
        ],
        'product_images': {
            'img_1': 'product-1616756200312.jpg'
        },
        'availability_count': 0
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': 'a54841be-cbca-4465-8fec-c0ec59815d5a',
        'search_product_name': 'product-165',
        'product_name': 'Product-165',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'removed_images': [],
        'ABV': '35',
        'updatedAt': 1630412276941,
        'sizeVariantList': [
            {
                'upc_code': 1778,
                'sku_code': '1990',
                'variant_size': 150,
                'variant_type': 'ml'
            }
        ],
        'product_images': {
            'img_1': 'product-1617093898686.jpg'
        },
        'description': '<font face="Arial">Testing description</font>',
        'availability_count': 0
    }
];

const FulfillmentSizeVariants = [
    {
        'product_id': '94e47093-24c8-4661-aa4e-6735dfd74a59',
        'variant_id': '409f7160-0bf9-4be7-8092-825b0b0a87ee',
        'variant_type': 'ml',
        'upc_code': 555,
        'sku_code': 'LNJ-CHARDSAMP-NV',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_name': 'Product-161',
        'updatedAt': 1617099838485,
        'alcohol_type': 'Beer',
        'createdAt': 1617099838485,
        'variant_size': 55
    },
    {
        'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
        'variant_id': '2c0b9af0-0e95-4ce3-a69f-296d4e3d35c5',
        'variant_type': 'ml',
        'upc_code': 878888,
        'sku_code': 'LNJ-CABSAMP-NV',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_name': 'Product-162',
        'updatedAt': 1616680638022,
        'alcohol_type': 'Gin',
        'createdAt': 1616680638022,
        'variant_size': 99
    },
    {
        'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
        'variant_id': 'e52bf9bb-fc1a-4c8e-a5c0-af2ab4fbeaqa',
        'variant_type': 'ml',
        'upc_code': 7888,
        'sku_code': 'LNJ-CABSAMP-NV',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_name': 'Product-162',
        'updatedAt': 1616680638012,
        'alcohol_type': 'Gin',
        'createdAt': 1616680638019,
        'variant_size': 12
    },
    {
        'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
        'variant_id': 'dbcb5d2a-4219-45d7-80b6-dde1ecdd0524',
        'variant_type': 'ml',
        'upc_code': 1,
        'product_name': 'Product-163',
        'sku_code': 'LNJ-CABABC-NV',
        'alcohol_type': 'Rum',
        'createdAt': 1633013548667,
        'variant_size': 12,
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 1633013548666,
        'variant': '12 ml'
    },
    {
        'product_id': '1643cafd-ee40-4462-adc0-d49a5e3610e8',
        'variant_id': '01717f43-a891-45d8-86dc-7494f3548b09',
        'variant_type': 'ml',
        'upc_code': 7899,
        'sku_code': 'LNJ-CABSAMP-NV',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_name': 'Product-164',
        'updatedAt': 1616756215901,
        'alcohol_type': 'Tequila',
        'createdAt': 1616756215901,
        'variant_size': 13
    },
    {
        'product_id': 'a54841be-cbca-4465-8fec-c0ec59815d5a',
        'variant_id': '01717f43-a891-45d8-86dc-7494f3512d31',
        'variant_type': 'ml',
        'upc_code': 1778,
        'sku_code': 'LNJ-CABSAMP-NV',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_name': 'Product-165',
        'updatedAt': 1616756215912,
        'alcohol_type': 'Wine',
        'createdAt': 1616756215934,
        'variant_size': 150
    }
];
const FulfillmentInventory = [
    {
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'createdAt': 1634108963219,
        'size': '55 ml',
        'search_product_name': 'product-161',
        'product_name': 'Product-161',
        'alcohol_type': 'Beer',
        'upc_code': 555,
        'sku_code': 'LNJ-CHARDSAMP-NV',
        'search_sku_code': 'lnj-chardsamp-nv',
        'search_alcohol_type': 'beer',
        'unit_price': 120,
        'brand_name': 'Brand-3',
        'stock': 97,
        'search_stock': '97',
        'search_brand_name': 'brand-3',
        'product_id': '94e47093-24c8-4661-aa4e-6735dfd74a59',
        'sort_brand_name': 'brand-3',
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 1634108963219,
        'select': true,
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'search_size': '55 ml',
        'price': '$120',
        'fulfillment_product_id': '0000000',
        'search_fulfillment_product_id': '0000000',
        'warehouse': 'CA Convoy Beverage Alliance',
        'location_group': 'CA Convoy Beverage Alliance',
        'location': 'CBA Tax Paid'
    },
    {
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'createdAt': 1634108963218,
        'size': '99 ml',
        'search_product_name': 'product-162',
        'product_name': 'Product-162',
        'alcohol_type': 'Gin',
        'upc_code': 878888,
        'sku_code': 'LNJ-CABSAMP-NV',
        'search_sku_code': 'lnj-cabsamp-nv',
        'search_alcohol_type': 'gin',
        'unit_price': 130,
        'brand_name': 'Brand-3',
        'stock': 100,
        'search_stock': '100',
        'search_brand_name': 'brand-3',
        'product_id': '4a824d42-23c7-45c8-90fb-1e6e5607fa07',
        'sort_brand_name': 'brand-3',
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 1634108963218,
        'select': true,
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'search_size': '99 ml',
        'price': '$130',
        'fulfillment_product_id': '0000001',
        'search_fulfillment_product_id': '0000001',
        'warehouse': 'CA Convoy Beverage Alliance',
        'location_group': 'CA Convoy Beverage Alliance',
        'location': 'CBA Tax Paid'
    },
    {
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'createdAt': 16341089632,
        'size': '12 ml',
        'search_product_name': 'product-163',
        'product_name': 'Product-163',
        'alcohol_type': 'Rum',
        'upc_code': 1,
        'sku_code': 'LNJ-CABABC-NV',
        'search_sku_code': 'lnj-cababc-nv',
        'search_alcohol_type': 'rum',
        'unit_price': 130,
        'brand_name': 'Brand-3',
        'stock': 100,
        'search_stock': '100',
        'search_brand_name': 'brand-3',
        'product_id': 'f87629c6-9a81-499a-bfa9-b88f2747114b',
        'sort_brand_name': 'brand-3',
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 16341089632,
        'select': true,
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'search_size': '12 ml',
        'price': '$130',
        'fulfillment_product_id': '0000001',
        'search_fulfillment_product_id': '0000001',
        'warehouse': 'CA Convoy Beverage Alliance',
        'location_group': 'CA Convoy Beverage Alliance',
        'location': 'CBA Tax Paid'
    },
    {
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'createdAt': 16341089633,
        'size': '13 ml',
        'search_product_name': 'product-164',
        'product_name': 'Product-164',
        'alcohol_type': 'Tequila',
        'upc_code': 7899,
        'sku_code': 'LNJ-CABSAMP-NV',
        'search_sku_code': 'lnj-cabsamp-nv',
        'search_alcohol_type': 'tequila',
        'unit_price': 135,
        'brand_name': 'Brand-3',
        'stock': 100,
        'search_stock': '100',
        'search_brand_name': 'brand-3',
        'product_id': '1643cafd-ee40-4462-adc0-d49a5e3610e8',
        'sort_brand_name': 'brand-3',
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 16341089633,
        'select': true,
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'search_size': '13 ml',
        'price': '$135',
        'fulfillment_product_id': '0000001',
        'search_fulfillment_product_id': '0000001',
        'warehouse': 'CA Convoy Beverage Alliance',
        'location_group': 'CA Convoy Beverage Alliance',
        'location': 'CBA Tax Paid'
    },
    {
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'createdAt': 16341089634,
        'size': '150 ml',
        'search_product_name': 'product-165',
        'product_name': 'Product-165',
        'alcohol_type': 'Wine',
        'upc_code': 1778,
        'sku_code': 'LNJ-CABSAMP-NV',
        'search_sku_code': 'lnj-cabsamp-nv',
        'search_alcohol_type': 'wine',
        'unit_price': 135,
        'brand_name': 'Brand-3',
        'stock': 100,
        'search_stock': '100',
        'search_brand_name': 'brand-3',
        'product_id': '1643cafd-ee40-4462-adc0-d49a5e3610e8',
        'sort_brand_name': 'brand-3',
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 16341089634,
        'select': true,
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'search_size': '150 ml',
        'price': '$135',
        'fulfillment_product_id': '0000001',
        'search_fulfillment_product_id': '0000001',
        'warehouse': 'CA Convoy Beverage Alliance',
        'location_group': 'CA Convoy Beverage Alliance',
        'location': 'CBA Tax Paid'
    }
];

const AutoIncrement = [{
    id: 'f056a468-570f-4224-9a18-e2088a688a70',
    increment_type: 'po_number',
    increment_number: 200001
}];

// ShipCompliant Product Test Data
const ShipCompliantProducts = [
    {
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_id': '55a2e7aa-9883-4ed2-90e0-f9f419635c79',
        'search_product_name': 'superiore brut nv 12/375ml 11%',
        'product_name': 'Superiore Brut NV 12/375ml 11%',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '11',
        'updatedAt': 1630412276557,
        'sizeVariantList': [
            {
                'upc_code': 555,
                'sku_code': 'UVE-GB12NV',
                'variant_size': 375,
                'variant_id': '40885f61-4400-4fd7-86ae-8d518d53adb1',
                'variant_type': 'ml',
                'product_id': '55a2e7aa-9883-4ed2-90e0-f9f419635c79'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1622548895407.jpeg'
        },
        'description': 'ADAMI Bosco di Gica Valdobbiadene DOCG Prosecco Superiore Brut NV 12/375ml 11%',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
        'search_product_name': 'superiore brut nv 12/750ml 11%',
        'product_name': 'Superiore Brut NV 12/750ml 11%',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '11',
        'updatedAt': 1630412276558,
        'sizeVariantList': [
            {
                'upc_code': 666,
                'sku_code': 'UVE-GB32NV',
                'variant_size': 750,
                'variant_id': '40419693-453a-4727-9411-7d994495e932',
                'variant_type': 'ml',
                'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1622548895407.jpeg'
        },
        'description': 'ADAMI Bosco di Gica Valdobbiadene DOCG Prosecco Superiore Brut NV 12/750ml 11%',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_id': 'e642bbed-3fb1-49e2-a424-3555bc36cb0a',
        'search_product_name': 'valdobbiadene docg dry nv 12/750ml 11%',
        'product_name': 'Valdobbiadene DOCG Dry NV 12/750ml 11%',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '11',
        'updatedAt': 1630412276559,
        'sizeVariantList': [
            {
                'upc_code': 777,
                'sku_code': 'UVE-GC32NV',
                'variant_size': 750,
                'variant_id': '7420a254-0b57-4fa1-ba84-ea88e3a98cf0',
                'variant_type': 'ml',
                'product_id': 'e642bbed-3fb1-49e2-a424-3555bc36cb0a'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'description': 'ADAMI Cartizze Valdobbiadene DOCG Dry NV 12/750ml 11%',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_id': '9192bec6-e6ce-420b-96df-0fbdfe3b721e',
        'search_product_name': 'valdobbiadene docg prosecco superiore extra dry nv 12/750ml 11%',
        'product_name': 'Valdobbiadene DOCG Prosecco Superiore Extra Dry NV 12/750ml 11%',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '11',
        'updatedAt': 1630412276561,
        'sizeVariantList': [
            {
                'upc_code': 888,
                'sku_code': 'UVE-GD32NV',
                'variant_size': 750,
                'variant_id': '1bb38db4-bafc-4be1-a69b-a6b0206ba746',
                'variant_type': 'ml',
                'product_id': '9192bec6-e6ce-420b-96df-0fbdfe3b721e'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1622549139427.jpeg'
        },
        'description': 'ADAMI Dei Casel Valdobbiadene DOCG Prosecco Superiore Extra Dry NV 12/750ml 11%',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_id': '047723b7-fba8-4255-b035-dafb3f15d93f',
        'search_product_name': 'valdobbiadene docg rive di farra di soligo brut 2018 12/750ml 11%',
        'product_name': 'Valdobbiadene DOCG Rive di Farra di Soligo Brut 2018 12/750ml 11%',
        'product_status': 1,
        'alcohol_type': 'Wine',
        'variants_count': 1,
        'is_catalog_product': true,
        'ABV': '11',
        'updatedAt': 1630412276562,
        'sizeVariantList': [
            {
                'upc_code': 999,
                'sku_code': 'UVE-GR3218',
                'variant_size': 750,
                'variant_id': 'f3ba6030-2359-4d36-9880-25790d4e0dee',
                'variant_type': 'ml',
                'product_id': '047723b7-fba8-4255-b035-dafb3f15d93f'
            }
        ],
        'states': [],
        'product_images': {
            'img_1': 'product-1622548938405.jpg'
        },
        'description': 'ADAMI Col Credas Valdobbiadene DOCG Rive di Farra di Soligo Brut 2018 12/750ml 11%',
        'availability_count': 0,
        'featured': 'false'
    }
];

const ShipCompliantSizeVariants = [
    {
        'product_id': '55a2e7aa-9883-4ed2-90e0-f9f419635c79',
        'variant_id': '40885f61-4400-4fd7-86ae-8d518d53adb1',
        'variant_type': 'ml',
        'upc_code': 555,
        'sku_code': 'UVE-GB12NV',
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_name': 'Superiore Brut NV 12/375ml 11%',
        'updatedAt': 1617099838485,
        'alcohol_type': 'Wine',
        'createdAt': 1617099838485,
        'variant_size': 375
    },
    {
        'product_id': '8de7091a-95c2-426d-9b21-ee3fd9da339a',
        'variant_id': '40419693-453a-4727-9411-7d994495e932',
        'variant_type': 'ml',
        'upc_code': 666,
        'sku_code': 'UVE-GB32NV',
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_name': 'Superiore Brut NV 12/750ml 11%',
        'updatedAt': 1617099838486,
        'alcohol_type': 'Wine',
        'createdAt': 1617099838486,
        'variant_size': 750
    },
    {
        'product_id': 'e642bbed-3fb1-49e2-a424-3555bc36cb0a',
        'variant_id': '7420a254-0b57-4fa1-ba84-ea88e3a98cf0',
        'variant_type': 'ml',
        'upc_code': 777,
        'sku_code': 'UVE-GC32NV',
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_name': 'Valdobbiadene DOCG Dry NV 12/750ml 11%',
        'updatedAt': 1617099838487,
        'alcohol_type': 'Wine',
        'createdAt': 1617099838487,
        'variant_size': 750
    },
    {
        'product_id': '9192bec6-e6ce-420b-96df-0fbdfe3b721e',
        'variant_id': '1bb38db4-bafc-4be1-a69b-a6b0206ba746',
        'variant_type': 'ml',
        'upc_code': 888,
        'sku_code': 'UVE-GD32NV',
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_name': 'Valdobbiadene DOCG Prosecco Superiore Extra Dry NV 12/750ml 11%',
        'updatedAt': 1617099838488,
        'alcohol_type': 'Wine',
        'createdAt': 1617099838488,
        'variant_size': 750
    },
    {
        'product_id': '047723b7-fba8-4255-b035-dafb3f15d93f',
        'variant_id': 'f3ba6030-2359-4d36-9880-25790d4e0dee',
        'variant_type': 'ml',
        'upc_code': 999,
        'sku_code': 'UVE-GR3218',
        'brand_id': 'a1b6f5c7-422a-4b8e-8099-a51e0333e713',
        'product_name': 'Valdobbiadene DOCG Rive di Farra di Soligo Brut 2018 12/750ml 11%',
        'updatedAt': 1617099838489,
        'alcohol_type': 'Wine',
        'createdAt': 1617099838489,
        'variant_size': 750
    }
];

module.exports = {
    productAddresses: productAddresses,
    products: products,
    brands: brands,
    templates: templates,
    BrandRecipes: BrandRecipes,
    alcoholType: alcoholType,
    productsNew: productsNew,
    productAddressesNew: productAddressesNew,
    PromoCode: PromoCode,
    PortalUsers: PortalUsers,
    RetailerPortalUsers: RetailerPortalUsers,
    menu: menu,
    MenuPermissions: MenuPermissions,
    companies: companies,
    templateMaster: TemplateMaster,
    retailerMenu: RetailerMenu,
    retailerMenuPermissions: RetailerMenuPermissions,
    OrderStatus: OrderStatus,
    Roles: Roles,
    BrandProfileMenu: BrandProfileMenu,
    Markets1: marketsPart1,
    Markets2: marketsPart2,
    Markets3: marketsPart3,
    FulfillmentPortalUsers: FulfillmentPortalUsers,
    FulfillmentCenters: FulfillmentCenters,
    FulfillmentCenterMenu: FulfillmentCenterMenu,
    FulfillmentProducts: FulfillmentProducts,
    FulfillmentSizeVariants: FulfillmentSizeVariants,
    FulfillmentInventory: FulfillmentInventory,
    AutoIncrement: AutoIncrement,
    ShipCompliantProducts: ShipCompliantProducts,
    ShipCompliantSizeVariants: ShipCompliantSizeVariants
};
