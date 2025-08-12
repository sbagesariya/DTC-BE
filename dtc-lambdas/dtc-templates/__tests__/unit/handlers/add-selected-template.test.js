var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1',
    endpoint: 'http://localhost:8000'
});
const db = require('dynamoose');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
db.aws.ddb.local('http://localhost:8000');
const lambda = require('../../../src/handlers/add-selected-template');
const dynamodb = require('aws-sdk/clients/dynamodb');
describe('Test AddSelectedTemplate', () => {
    let putSpy;
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put');
    });
    // Clean up mocks
    afterAll(() => {
        putSpy.mockRestore();
    });
    // This test invokes putItemHandler() and compare the result
    it('Should give brand id validation error', async () => {
        const returnedItem = {
            active: false,
            back_to_main_page_color: '#4A4A4A',
            template_id: 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
            back_to_main_page_hover_color: '#8B0E04',
            back_to_main_page_url: 'https://stgdtc.parkstreet.com/',
            banner_background_color: '#FAFAFA',
            banner_link: 'https://stgdtc.parkstreet.com/',
            banner_text: 'Brand Announcement like promotions, important notes, etc.',
            banner_text_color: '#000000',
            brand_awards_sub_heading: 'Brand Awards Subheading',
            brand_awards_sub_heading_bg_color: '#FAFAFA',
            brand_website: 'https://stgdtc.parkstreet.com/',
            buy_now_button_color: '#8B0E04',
            buy_now_button_text_color: '#FFFFFF',
            catalog_brand_background_color: '#FFFFFF',
            catalog_brand_sub_heading: 'Products',
            color_annoucement_bar: {
                bar: '#FAFAFA',
                text: '#232323'
            },
            color_background: {
                header_footer: '#FFFFFF',
                section: '#FFFFFF'
            },
            color_button: {
                background: '#8B0E04',
                border: '#8B0E04',
                text: '#FFFFFF'
            },
            color_text: {
                body_text: '#232323',
                heading_links: '#232323',
                subheading: '#232323'
            },
            company: 'Test Company',
            companyurl: 'http://test-company.com',
            favicon: 'logo.ico',
            favicon_alt_text: 'favicon',
            featured_product: 'Feature Product',
            featured_product_background_color: '#FAFAFA',
            featured_product_id: '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
            featured_products_description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            footer_background_color: '#FAFAFA',
            footer_text_color: '#232323',
            header_background_color: '#FFFFFF',
            link_hover_color: '#8B0E04',
            logo: 'logo.jpg',
            logo_alt_text: 'logo',
            logo_color: '#8B0E04',
            policy: 'http://test.com',
            product_background_color: '#FFFFFF',
            product_detail_button_background_color: '#8B0E04',
            product_detail_button_text_color: '#FAFAFA',
            product_detail_name_text_color: '#232323',
            product_detail_price_text_color: '#232323',
            product_detail_quantity_text_color: '#232323',
            product_detail_shipping_text_color: '#232323',
            product_detail_size_text_color: '#232323',
            product_detail_type_text_color: '#232323',
            product_list_button_background_color: '#8B0E04',
            product_list_button_text_color: '#FAFAFA',
            product_list_name_text_color: '#232323',
            product_list_price_text_color: '#232323',
            product_list_shipping_text_color: '#232323',
            product_list_size_text_color: '#232323',
            product_text_color: '#4A4A4A',
            shopping_cart_icon_color: '#4A4A4A',
            shopping_cart_icon_hover_color: '#8B0E04',
            sign_in_icon_color: '#4A4A4A',
            sign_in_icon_hover_color: '#8B0E04',
            template_img_full:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
            template_img_half:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
            template_name: 'Debut Template',
            term_url: 'http://test.com',
            terms_and_policy_color: '#4A4A4A',
            terms_and_policy_hover_color: '#8B0E04',
            typography_body: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_heading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_subheading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            }
        };
        // Return the specified value whenever the spied put function is called
        // putSpy.mockReturnValue({
        //     promise: () => Promise.resolve(returnedItem)
        // });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(returnedItem)
        };
        // Invoke putItemHandler()
        const result = await lambda.AddSelectedTemplateHandler(event);
        // Compare the result with the expected result
        expect((JSON.parse(result.body)).status).toEqual(0);
    });

    it('Should give template id validation error', async () => {
        const returnedItem = {
            active: false,
            back_to_main_page_color: '#4A4A4A',
            back_to_main_page_hover_color: '#8B0E04',
            back_to_main_page_url: 'https://stgdtc.parkstreet.com/',
            banner_background_color: '#FAFAFA',
            banner_link: 'https://stgdtc.parkstreet.com/',
            banner_text: 'Brand Announcement like promotions, important notes, etc.',
            banner_text_color: '#000000',
            brand_awards_sub_heading: 'Brand Awards Subheading',
            brand_awards_sub_heading_bg_color: '#FAFAFA',
            brand_id: '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
            brand_website: 'https://stgdtc.parkstreet.com/',
            buy_now_button_color: '#8B0E04',
            buy_now_button_text_color: '#FFFFFF',
            catalog_brand_background_color: '#FFFFFF',
            catalog_brand_sub_heading: 'Products',
            color_annoucement_bar: {
                bar: '#FAFAFA',
                text: '#232323'
            },
            color_background: {
                header_footer: '#FFFFFF',
                section: '#FFFFFF'
            },
            color_button: {
                background: '#8B0E04',
                border: '#8B0E04',
                text: '#FFFFFF'
            },
            color_text: {
                body_text: '#232323',
                heading_links: '#232323',
                subheading: '#232323'
            },
            company: 'Test Company',
            companyurl: 'http://test-company.com',
            favicon: 'logo.ico',
            favicon_alt_text: 'favicon',
            featured_product: 'Feature Product',
            featured_product_background_color: '#FAFAFA',
            featured_product_id: '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
            featured_products_description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            footer_background_color: '#FAFAFA',
            footer_text_color: '#232323',
            header_background_color: '#FFFFFF',
            link_hover_color: '#8B0E04',
            logo: 'logo.jpg',
            logo_alt_text: 'logo',
            logo_color: '#8B0E04',
            policy: 'http://test.com',
            product_background_color: '#FFFFFF',
            product_detail_button_background_color: '#8B0E04',
            product_detail_button_text_color: '#FAFAFA',
            product_detail_name_text_color: '#232323',
            product_detail_price_text_color: '#232323',
            product_detail_quantity_text_color: '#232323',
            product_detail_shipping_text_color: '#232323',
            product_detail_size_text_color: '#232323',
            product_detail_type_text_color: '#232323',
            product_list_button_background_color: '#8B0E04',
            product_list_button_text_color: '#FAFAFA',
            product_list_name_text_color: '#232323',
            product_list_price_text_color: '#232323',
            product_list_shipping_text_color: '#232323',
            product_list_size_text_color: '#232323',
            product_text_color: '#4A4A4A',
            shopping_cart_icon_color: '#4A4A4A',
            shopping_cart_icon_hover_color: '#8B0E04',
            sign_in_icon_color: '#4A4A4A',
            sign_in_icon_hover_color: '#8B0E04',
            template_img_full:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
            template_img_half:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
            template_name: 'Debut Template',
            term_url: 'http://test.com',
            terms_and_policy_color: '#4A4A4A',
            terms_and_policy_hover_color: '#8B0E04',
            typography_body: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_heading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_subheading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            }
        };
        // Return the specified value whenever the spied put function is called
        // putSpy.mockReturnValue({
        //     promise: () => Promise.resolve(returnedItem)
        // });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(returnedItem)
        };
        // Invoke putItemHandler()
        const result = await lambda.AddSelectedTemplateHandler(event);
        // Compare the result with the expected result
        expect((JSON.parse(result.body)).status).toEqual(0);
    });

    it('Should add selected template to library', async () => {
        const returnedItem = {
            active: false,
            back_to_main_page_color: '#4A4A4A',
            back_to_main_page_hover_color: '#8B0E04',
            back_to_main_page_url: 'https://stgdtc.parkstreet.com/',
            banner_background_color: '#FAFAFA',
            banner_link: 'https://stgdtc.parkstreet.com/',
            banner_text: 'Brand Announcement like promotions, important notes, etc.',
            banner_text_color: '#000000',
            brand_awards_sub_heading: 'Brand Awards Subheading',
            brand_awards_sub_heading_bg_color: '#FAFAFA',
            brand_id: '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
            template_id: 'c6c01980-9b9e-4325-95ad-3ee3193cebb5',
            brand_website: 'https://stgdtc.parkstreet.com/',
            buy_now_button_color: '#8B0E04',
            buy_now_button_text_color: '#FFFFFF',
            catalog_brand_background_color: '#FFFFFF',
            catalog_brand_sub_heading: 'Products',
            color_annoucement_bar: {
                bar: '#FAFAFA',
                text: '#232323'
            },
            color_background: {
                header_footer: '#FFFFFF',
                section: '#FFFFFF'
            },
            color_button: {
                background: '#8B0E04',
                border: '#8B0E04',
                text: '#FFFFFF'
            },
            color_text: {
                body_text: '#232323',
                heading_links: '#232323',
                subheading: '#232323'
            },
            company: 'Test Company',
            companyurl: 'http://test-company.com',
            favicon: 'logo.ico',
            favicon_alt_text: 'favicon',
            featured_product: 'Feature Product',
            featured_product_background_color: '#FAFAFA',
            featured_product_id: '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
            featured_products_description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            footer_background_color: '#FAFAFA',
            footer_text_color: '#232323',
            header_background_color: '#FFFFFF',
            link_hover_color: '#8B0E04',
            logo: 'logo.jpg',
            logo_alt_text: 'logo',
            logo_color: '#8B0E04',
            policy: 'http://test.com',
            product_background_color: '#FFFFFF',
            product_detail_button_background_color: '#8B0E04',
            product_detail_button_text_color: '#FAFAFA',
            product_detail_name_text_color: '#232323',
            product_detail_price_text_color: '#232323',
            product_detail_quantity_text_color: '#232323',
            product_detail_shipping_text_color: '#232323',
            product_detail_size_text_color: '#232323',
            product_detail_type_text_color: '#232323',
            product_list_button_background_color: '#8B0E04',
            product_list_button_text_color: '#FAFAFA',
            product_list_name_text_color: '#232323',
            product_list_price_text_color: '#232323',
            product_list_shipping_text_color: '#232323',
            product_list_size_text_color: '#232323',
            product_text_color: '#4A4A4A',
            shopping_cart_icon_color: '#4A4A4A',
            shopping_cart_icon_hover_color: '#8B0E04',
            sign_in_icon_color: '#4A4A4A',
            sign_in_icon_hover_color: '#8B0E04',
            template_img_full:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
            template_img_half:
        'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
            template_name: 'Debut Template',
            term_url: 'http://test.com',
            terms_and_policy_color: '#4A4A4A',
            terms_and_policy_hover_color: '#8B0E04',
            typography_body: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_heading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            },
            typography_subheading: {
                font_family: 'HelveticaNeue',
                font_style: 'Regular'
            }
        };
        // Return the specified value whenever the spied put function is called
        // putSpy.mockReturnValue({
        //     promise: () => Promise.resolve(returnedItem)
        // });
        const event = {
            httpMethod: 'POST',
            body: JSON.stringify(returnedItem)
        };
        // Invoke putItemHandler()
        const result = await lambda.AddSelectedTemplateHandler(event);
        expect((JSON.parse(result.body)).status).toEqual(1);
    });
});