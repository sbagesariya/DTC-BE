const Retailers = [
    {
        'addresses': [
            {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'lat': '12345',
                'long': '-12333334',
                'state': 'Florida',
                'zip_code': '456456'
            },
            {
                'address_line_1': 'third',
                'address_line_2': 'fourth',
                'city': 'city-2',
                'country': 'US',
                'lat': '133432435435',
                'long': '-143243242424',
                'state': 'Florida',
                'zip_code': '12345'
            }
        ],
        'shipping_tier': [
            {
                'tier_ends': 100,
                'tier_order': 1,
                'tier_id': '5f6d6610-45f2-11ec-95f0-0114f612dfd3',
                'tier_amount': 25.05,
                'tier_starts': 0
            },
            {
                'tier_ends': 200,
                'tier_order': 2,
                'tier_id': '5f6d6611-45f2-11ec-95f0-0114f612dfd3',
                'tier_amount': 35.25,
                'tier_starts': 100.01
            }
        ],
        'shipping_option': 2,
        'createdAt': 1623830716952,
        'primary_address': {
            'address_line_1': 'first',
            'address_line_2': 'second',
            'city': 'city-1',
            'country': 'US',
            'lat': '12345',
            'long': '-12333334',
            'state': 'Florida',
            'zip_code': '456456'
        },
        'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'retailer_name': 'Total Wine',
        'updatedAt': 1626959951447
    }, {
        'addresses': [
            {
                'address_line_1': 'first',
                'address_line_2': 'second',
                'city': 'city-1',
                'country': 'US',
                'lat': '12345',
                'long': '-12333334',
                'state': 'Florida',
                'zip_code': '456456'
            },
            {
                'address_line_1': 'third',
                'address_line_2': 'fourth',
                'city': 'city-2',
                'country': 'US',
                'lat': '133432435435',
                'long': '-143243242424',
                'state': 'Florida',
                'zip_code': '12345'
            }
        ],
        'shipping_tier': [
            {
                'tier_ends': 100,
                'tier_order': 1,
                'tier_id': '6eb14332-3127-4392-8d5d-c891da9616f2',
                'tier_amount': 25.05,
                'tier_starts': 0
            },
            {
                'tier_ends': 200,
                'tier_order': 2,
                'tier_id': '6840fa44-2c0e-421b-96a7-4e77a8850085',
                'tier_amount': 35.25,
                'tier_starts': 100.01
            }
        ],
        'shipping_option': 2,
        'createdAt': 1643812799182,
        'primary_address': {
            'address_line_1': 'first',
            'address_line_2': 'second',
            'city': 'city-1',
            'country': 'US',
            'lat': '12345',
            'long': '-12333334',
            'state': 'Florida',
            'zip_code': '456456'
        },
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'retailer_name': 'Dominica Retailer Cleverley',
        'updatedAt': 1643812799182
    }
];
const Order = [
    {
        'billing_address': {
            'address_line_1': 'Beverly Boulevard',
            'city': 'Los Angeles',
            'first_name': 'Test',
            'last_name': 'Test',
            'state': 'California',
            'zip_code': '90048'
        },
        'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
        'brand_name': 'brand-2',
        'createdAt': 1615360434608,
        'po_number': 'DTC200072',
        'delivery_address': {
            'address_line_1': 'Beverly Boulevard',
            'city': 'Los Angeles',
            'first_name': 'Test',
            'last_name': 'Test',
            'state': 'California',
            'street': '8500',
            'zip_code': '90048'
        },
        'estimated_delivery_date': 1615619634608,
        'gift_note': '',
        'instructions': '',
        'order_id': '490248-FF65B',
        'order_status': 'Pending',
        'payment_detail': {
            'discount': '0',
            'shipping_charge': '15.00',
            'tax': '12.00',
            'total': '157',
            'stripe_payment_intent_id': '645SDFS897321'
        },
        'product_detail': [
            {
                'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
                'name': 'Product-2',
                'price': 65,
                'product_id': '379ed278-4df7-4fa5-b418-a7f6cbf58f5a',
                'qty': 2,
                'size': '750 mL'
            }
        ],
        'retailer': 'Adelind Retailer Derrick',
        'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'search_brand_name': 'brand-2',
        'search_estimated_delivery_date': '03/13/2021',
        'search_order_id': '490248-ff65b',
        'search_placed_on': '03/10/2021',
        'search_retailer': 'adelind retailer derrick',
        'search_state': 'california',
        'search_status': 'pending',
        'search_total': 157,
        'search_user_name': 'johanan test',
        'sort_brand_name': 'brand-2',
        'sort_order_id': '490248-FF65B',
        'sort_state': 'California',
        'sort_total': 157,
        'updatedAt': 1609916490038,
        'user_detail': {
            'date_of_birth': '2000-11-27',
            'first_name': 'Johanan',
            'last_name': 'Test',
            'phone': '12345678',
            'user_type': 'guest'
        },
        'user_email': 'jt@test.com'
    }, {
        'billing_address': {
            'address_line_1': 'Beverly Boulevard',
            'city': 'Los Angeles',
            'first_name': 'Manali',
            'last_name': 'Sh',
            'state': 'CA',
            'zip_code': '90048'
        },
        'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
        'brand_name': 'brand-2',
        'createdAt': 1617083519427,
        'po_number': 'DTC200073',
        'delivery_address': {
            'address_line_1': 'Beverly Boulevard',
            'city': 'Los Angeles',
            'first_name': 'Manali',
            'last_name': 'Sh',
            'state': 'CA',
            'street': '8500',
            'zip_code': '90048'
        },
        'estimated_delivery_date': 1617342719427,
        'gift_note': '',
        'instructions': '',
        'order_id': '261989-88364',
        'order_status': 'Pending',
        'payment_detail': {
            'discount': '0',
            'shipping_charge': '15.00',
            'stripe_payment_intent_id': 'pi_1ID5LoG3qi1rhSM7RZnxvMzK',
            'stripe_payment_method': 'pm_1ID5LpG3qi1rhSM739DaM5Ji',
            'sub_total': '73.00',
            'tax': '12.00',
            'total': '100.00'
        },
        'product_detail': [
            {
                'name': 'Product-8',
                'price': 73,
                'product_id': '1fcd3755-b023-4283-8bbe-077acd57c92c',
                'qty': 1,
                'size': '750 mL'
            }
        ],
        'retailer': 'Adelind Retailer Derrick',
        'retailer_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'search_brand_name': 'brand-2',
        'search_estimated_delivery_date': '04/02/2021',
        'search_order_id': '261989-88364',
        'search_placed_on': '03/30/2021',
        'search_retailer': 'adelind retailer derrick',
        'search_state': 'ca',
        'search_status': 'pending',
        'search_total': 100,
        'search_user_name': 'mana shr',
        'sort_brand_name': 'brand-2',
        'sort_order_id': '261989-88364',
        'sort_state': 'CA',
        'sort_total': 100,
        'updatedAt': 1611482261930,
        'user_detail': {
            'date_of_birth': '2000-11-28',
            'first_name': 'Mana',
            'last_name': 'Shr',
            'phone': '234567980',
            'user_type': 'guest'
        },
        'user_email': 'msharma@parkstreet.com'
    },
    {
        'instructions': '',
        'newsletter': true,
        'delivery_address': {
            'city': 'Los Angeles',
            'street': '8500',
            'address_line_1': 'Beverly Boulevard',
            'last_name': '',
            'state': 'CA',
            'first_name': 'Jenny',
            'zip_code': '90048'
        },
        'search_estimated_delivery_date': '04/12/2021',
        'product_detail': [
            {
                'name': 'Product-144',
                'size': '750 mL',
                'price': 102,
                'product_id': '4dadd7cc-3fa8-4b4f-bb35-6ea74c694536',
                'qty': 1
            },
            {
                'name': 'Product-11',
                'size': '750 mL',
                'price': 200,
                'product_id': '4e4e3467-bd0a-4d85-a3af-c7008d0b1aa3',
                'qty': 1
            }
        ],
        'search_total': 329,
        'billing_address': {
            'address_line_1': 'Beverly Boulevard',
            'last_name': '',
            'state': 'CA',
            'city': 'Los Angeles',
            'first_name': 'Jenny',
            'zip_code': '90048'
        },
        'estimated_delivery_date': 1618228269979,
        'createdAt': 1617969069979,
        'po_number': 'DTC200074',
        'order_status': 'Received',
        'search_status': 'received',
        'sort_order_id': '069998-43585',
        'sort_total': 329,
        'sort_state': 'CA',
        'search_brand_name': 'brand-3',
        'sort_brand_name': 'brand-3',
        'updatedAt': 1617969069877,
        'gift_note': '',
        'payment_detail': {
            'total': '329.00',
            'shipping_charge': '15.00',
            'stripe_payment_method': 'pm_1IeIrlG3qi1rhSM7iqecR1z4',
            'stripe_payment_intent_id': 'pi_1IeIrkG3qi1rhSM7ypjPNAcm',
            'sub_total': '302.00',
            'discount': '0',
            'promo_code': '',
            'tax': '12.00'
        },
        'search_state': 'ca',
        'user_email': 'msharma@parkstreet.com',
        'retailer': 'Collin Retailer Finlason',
        'user_detail': {
            'last_name': 'Flock',
            'user_type': 'guest',
            'first_name': 'Jenny',
            'phone': '87656789',
            'date_of_birth': '2000-12-6'
        },
        'retailer_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
        'brand_name': 'Brand-3',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'search_order_id': '069998-43585',
        'search_retailer': 'collin retailer finlason',
        'search_user_name': 'jenny flock',
        'search_placed_on': '04/09/2021',
        'order_id': '069998-43585'
    }, {
        'instructions': '',
        'newsletter': true,
        'delivery_address': {
            'city': 'Los Angeles',
            'street': '8500',
            'address_line_1': 'Beverly Boulevard',
            'last_name': '',
            'state': 'CA',
            'first_name': 'Jenny',
            'zip_code': '90048'
        },
        'search_estimated_delivery_date': '04/12/2021',
        'product_detail': [
            {
                'name': 'test-56',
                'size': '12 mL',
                'price': 102,
                'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
                'qty': 1
            }
        ],
        'search_total': 329,
        'billing_address': {
            'address_line_1': 'Beverly Boulevard',
            'last_name': '',
            'state': 'CA',
            'city': 'Los Angeles',
            'first_name': 'Jenny',
            'zip_code': '90048'
        },
        'estimated_delivery_date': 1618228269979,
        'createdAt': 1638962000388,
        'po_number': 'DTC200075',
        'order_status': 'Received',
        'search_status': 'received',
        'sort_order_id': '383430-2A5E9',
        'sort_total': 329,
        'sort_state': 'CA',
        'search_brand_name': 'brand-3',
        'sort_brand_name': 'brand-3',
        'updatedAt': 1638962000388,
        'gift_note': '',
        'payment_detail': {
            'total': '329.00',
            'shipping_charge': '15.00',
            'stripe_payment_method': 'pm_1IeIrlG3qi1rhSM7iqecR1z4',
            'stripe_payment_intent_id': 'pi_1IeIrkG3qi1rhSM7ypjPNAcm',
            'sub_total': '302.00',
            'discount': '0',
            'promo_code': '',
            'tax': '12.00'
        },
        'search_state': 'ca',
        'user_email': 'msharma@parkstreet.com',
        'retailer': 'Collin Retailer Finlason',
        'user_detail': {
            'last_name': 'Flock',
            'user_type': 'guest',
            'first_name': 'Jenny',
            'phone': '87656789',
            'date_of_birth': '2000-12-6'
        },
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'brand_name': 'Brand-3',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'search_order_id': '383430-2A5E9',
        'search_retailer': 'collin retailer finlason',
        'search_user_name': 'jenny flock',
        'search_placed_on': '04/09/2021',
        'order_id': '383430-2A5E9'
    },
    {
        'brand_id': '8fe49d41-c91d-46c3-a4f8-86be6483c186',
        'createdAt': 1647267243259,
        'created_from': 'TP-user',
        'instructions': 'Do good packaginDo good packaginDo good',
        'billing_address': {
            'country': 'US',
            'city': 'Los Angeles',
            'street': 'address 2',
            'address_line_1': 'Beverly Boulevard',
            'last_name': 'ps',
            'state': 'CA',
            'first_name': 'skajle',
            'same_as_delivery': true,
            'zip_code': '90048'
        },
        'sales_order_id': 'LNJ20004',
        'user_email': 'skajle@yopmail.com',
        'brand_name': 'Adami',
        'gift_note': '',
        'search_total': 30,
        'payment_status': 'Paid',
        'po_number': 'DTC200235',
        'payment_detail': {
            'total': '30.00',
            'payment_type': 'CreditCard',
            'shipping_charge': '15.00',
            'sub_total': '10.00',
            'discount': '3.00',
            'tax': '2.00',
            'promo_code': ''
        },
        'sort_brand_name': 'adami',
        'order_status': 'Pending',
        'search_placed_on': '03/14/2022',
        'search_status': 'pending',
        'search_user_name': 'skajle ps',
        'payment_date': 1618228269979,
        'sort_order_id': '243259-22D25',
        'search_order_id': '243259-22d25',
        'search_state': 'ca',
        'product_detail': [
            {
                'createdAt': 1644934619614,
                'size': '550 ml',
                'price': 10,
                'product_id': '9192bec6-e6ce-420b-96df-0fbdfe3b721e',
                'qty': 5,
                'name': 'Valdobbiadene DOCG Prosecco Superiore Extra Dry NV 12/750ml 11%',
                'sku_code': 'LNJ-CABSAMP-NV'
            }
        ],
        'fulfillment_types': 'Fulfillment Center',
        'search_estimated_delivery_date': '2022/03/14',
        'confirmation_order_number': 'AQZAR',
        'newsletter': false,
        'stripe_order_amount': '',
        'fulfillment_center': 'Park Street Fulfillment Center',
        'estimated_delivery_date': 1647216000000,
        'order_notes': 'Test notes',
        'search_brand_name': 'adami',
        'cardType': '',
        'tracking_id': 'AR123RRR',
        'user_detail': {
            'last_name': 'ps',
            'first_name': 'skajle',
            'phone': '9039712357',
            'date_of_birth': '08/17/1993'
        },
        'user_id': 'DTC-SKA-908EF2',
        'order_id': '243259-22D25',
        'fulfillment_center_id': 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        'transaction_type': 'Sales Order',
        'accept_terms': true,
        'sort_total': 30,
        'tracking_company': '3R VAN',
        'delivery_address': {
            'country': 'US',
            'city': 'Los Angeles',
            'street': 'address 2',
            'address_line_1': 'Beverly Boulevard',
            'last_name': 'ps',
            'state': 'CA',
            'first_name': 'skajle',
            'zip_code': '90048'
        },
        'sort_state': 'CA'
    }
];
const SizeVariants = [
    {
        'createdAt': 1616754519602,
        'alcohol_type': 'Spirit',
        'variant_id': '6cdd77f5-8afa-4f69-ab46-6753eaec8412',
        'variant_type': 'ml',
        'product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'upc_code': 98900,
        'variant_size': 100,
        'product_name': 'Product-111',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'updatedAt': 1616754519602
    }, {
        'createdAt': 1616754519602,
        'alcohol_type': 'Spirit',
        'variant_id': '6cdd77f5-8afa-4f69-ab76-6753eaec8412',
        'variant_type': 'ml',
        'product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'upc_code': 98900,
        'variant_size': 50,
        'product_name': 'Product-111',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'updatedAt': 1616754519602
    }, {
        'createdAt': 1616754519602,
        'alcohol_type': 'Spirit',
        'variant_id': '6cdd77f5-8afa-4f69-ab76-6754eaec8412',
        'variant_type': 'ml',
        'product_id': '332823dd-3962-4444-a2bf-6d8a9c5583ef',
        'upc_code': 98900,
        'variant_size': 10,
        'product_name': 'Product-111',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'updatedAt': 1616754519602
    }, {
        'createdAt': 1643811260188,
        'alcohol_type': 'Gin',
        'variant_id': 'ff0ae216-7edd-4bb1-9b13-4980fa8fc3a3',
        'variant_type': 'ml',
        'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
        'upc_code': 7888,
        'variant_size': 12,
        'product_name': 'test-56',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 1643811260188,
        'sku_code': 'UVE-GB3212'
    }, {
        'createdAt': 1596825000000,
        'alcohol_type': 'Gin',
        'variant_id': 'fcd6fa60-8074-459a-bcc4-1d0dc1967670',
        'variant_type': 'ml',
        'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
        'upc_code': 98900,
        'variant_size': 10,
        'product_name': 'test-56',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'updatedAt': 1596825000000,
        'sku_code': 'UVE-GB3234'
    }, {
        'createdAt': 1639749760294,
        'alcohol_type': 'Gin',
        'variant_id': 'e804398f-fde9-431c-ab98-6cd9f81fa0b7',
        'variant_type': 'ml',
        'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
        'upc_code': 7888,
        'variant_size': 12,
        'product_name': 'test-56',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'updatedAt': 1639749760294
    },
    {
        'createdAt': 1639749833115,
        'alcohol_type': 'Gin',
        'variant_id': '34c7dd60-635f-4195-a915-e549fd823b1e',
        'variant_type': 'ml',
        'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
        'upc_code': 878888,
        'variant_size': 99,
        'product_name': 'test-56',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'updatedAt': 1639749833115
    }
];

const SavedTemplates = [
    {
        'active': false,
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': 'https://stgdtc.parkstreet.com/',
        'banner_link': 'https://stgdtc.parkstreet.com/',
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'brand_website': 'https://stgdtc.parkstreet.com/',
        'color_annoucement_bar': {
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
        'company': 'Test Company',
        'companyurl': 'http://test-company.com',
        'createdAt': 1613130040902,
        'favicon': 'logo.ico',
        'favicon_alt_text': 'favicon',
        'featured_product': 'Feature Product',
        'featured_product_id': '128e8e32-c953-44ea-9bbc-9f29a10a6c54',
        'featured_products_description': 'Lorem ipsum',
        'homepage_header': {
            'announcement_bar_text': 'Brand Announcement like promotions, important notes, etc.'
        },
        'homepage_product_section_header': 'Products',
        'logo': 'logo.jpg',
        'logo_alt_text': 'logo',
        'max_content_card_limit': 0,
        'max_content_product': 999999,
        'min_content_card_limit': 0,
        'min_content_product': 1,
        'policy': 'http://test.com',
        'template_description': 'Have a lot of products?',
        'template_features': '["Ideal for 7+ products","Ideal for filtering and categorizing","Give a lot of information of each product"]',
        'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/3menu.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/3menu.png',
        'template_name': 'Menu Template',
        'term_url': 'http://test.com',
        'terms_and_policy_hover_color': '#8B0E04',
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
        },
        'updatedAt': 1613130040902
    },
    {
        'active': false,
        'back_to_main_page_hover_color': '#8B0E04',
        'back_to_main_page_url': 'https://stgdtc.parkstreet.com/',
        'banner_link': 'https://stgdtc.parkstreet.com/',
        'brand_id': '0088eed8-3481-4b4c-9f90-a2c4a6a606dc',
        'brand_website': 'https://stgdtc.parkstreet.com/',
        'color_annoucement_bar': {

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
        'company': 'Test Company',
        'companyurl': 'http://test-company.com',
        'favicon': '',
        'favicon_alt_text': 'favicon',
        'featured_product': 'Feature Product',
        'featured_product_id': '',
        'featured_products_description': 'Lorem ipsum dolor sit amet, consectetu',
        'homepage_content_section': {
            'heading': 'Content Section Heading',
            'images': [
                {
                    'order': 1,
                    'show': false,
                    'url': ''
                },
                {
                    'order': 2,
                    'show': true,
                    'url': ''
                },
                {
                    'order': 3,
                    'show': true,
                    'url': ''
                }
            ],
            'show_section': true
        },
        'homepage_header': {
            'announcement_bar_text': 'Brand Announcement like promotions, important notes, etc.',
            'custom_logo': 'test1.jpg',
            'homepage_only': true,
            'show_announcement': true
        },
        'homepage_product_section_header': 'Products',
        'logo': '1111111111111',
        'logo_alt_text': 'logo',
        'max_content_card_limit': 3,
        'max_content_product': 3,
        'min_content_card_limit': 1,
        'min_content_product': 1,
        'policy': 'http://test.com',
        'template_id': '51f462ba-decb-4970-84c4-73168004ac63',
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/1debut.png',
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/1debut.png',
        'template_name': 'Debut Template',
        'term_url': 'http://test.com',
        'terms_and_policy_hover_color': '#8B0E04',
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
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
        'min_content_product': 1,
        'template_img_half': 'https://dtc-stg-public.s3.amazonaws.com/template_images_half/3menu.png',
        'max_content_card_limit': 0,
        'max_content_product': 999999,
        'favicon_alt_text': 'favicon',
        'back_to_main_page_url': 'https://stgdtc.parkstreet.com/',
        'brand_name': 'Brand-3',
        'color_text': {
            'heading_links': '#232323',
            'subheading': '#161515',
            'body_text': '#232323'
        },
        'banner_link': 'https://stgdtc.parkstreet.com/',
        'term_url': 'http://test.com',
        'companyurl': 'http://test-company.com',
        'template_features': '["Ideal for 7+ products","Ideal for filtering and categorizing","Give a lot of information of each product"]',
        'color_button': {
            'border': '#8B0E04',
            'text': '#FFFFFF',
            'hover_color': 'rgb(95, 9, 2)',
            'background': '#8B0E04'
        },
        'template_name': 'Menu Template',
        'typography_body': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'active': true,
        'company': 'Test Company',
        'back_to_main_page_hover_color': '#8B0E04',
        'brand_website': 'https://stgdtc.parkstreet.com/',
        'policy': 'http://test.com',
        'favicon': '',
        'min_content_card_limit': 0,
        'color_background': {
            'header_footer': '#FFFFFF',
            'section': '#FFFFFF'
        },
        'homepage_content_section': {
            'heading': 'Content Section Heading',
            'images': [
                {
                    'show': false,
                    'url': '',
                    'order': 1
                },
                {
                    'show': true,
                    'url': '',
                    'order': 2
                },
                {
                    'show': true,
                    'url': '',
                    'order': 3
                }
            ],
            'show_section': true
        },
        'typography_heading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'createdAt': 1613118446511,
        'logo': 'https://dtc-stg-public.s3.amazonaws.com/logo-1621854695536.png',
        'template_description': 'Have a lot of products? Our Menu Template will give your customers ' +
            ' an easy way to navigate through them all.',
        'terms_and_policy_hover_color': '#8B0E04',
        'homepage_product_section_header': 'test',
        'color_annoucement_bar': {},
        'logo_alt_text': 'logo',
        'typography_subheading': {
            'font_family': 'HelveticaNeue',
            'font_style': 'Regular'
        },
        'updatedAt': 1649736790173,
        'homepage_header': {
            'custom_logo': 172,
            'homepage_only': false,
            'announcement_bar_text': 'All orders are fulfilled by Park Street retail fulfillment network',
            'show_announcement': true
        },
        'featured_products_description': '',
        'template_img_full': 'https://dtc-stg-public.s3.amazonaws.com/template_images_full/3menu.png',
        'featured_product_id': ''
    }
];
const SavedProducts = [
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'createdAt': 1624289957871,
        'size': [
            '750 mL',
            '375 mL',
            '1.75L'
        ],
        'price_matrix': {
            'scheduled_delivery': {
                '750_mL': '437',
                '1.75L': '435',
                '375_mL': '436'
            },
            'ground_shipping': {
                '750_mL': '434',
                '1.75L': '432',
                '375_mL': '433'
            }
        },
        'variants_count': 1,
        'large_image': 'text.png',
        'product_id': '8ff03895-c71c-450b-a65b-9d22db1bb1b3',
        'is_catalog_product': true,
        'shipping': [
            'Ground Shipping'
        ],
        'available_address': {
            'address_line_1': 'first',
            'country': 'US',
            'address_line_2': 'second',
            'state': 'Florida',
            'city': 'city-1',
            'zip_code': '456456'
        },
        'tasting_notes': [
            'Good!'
        ],
        'small_image': 'test.png',
        'availability_count': 1,
        'featured': 'false',
        'origin': 'New york',
        'search_product_name': 'product-141',
        'product_name': 'Product-141',
        'product_status': 1,
        'alcohol_type': 'Spirit',
        'order_n': 1,
        'template_id': 'af169e51-d7e0-4bba-8aff-cadc0d4637a1',
        'ABV': '12',
        'updatedAt': 1624289957871,
        'product_type': 'Spirit',
        'product_images': {
            'img_1': 'product-1622548836004.jpg'
        },
        'description': '<b><i><u>Dummy Product<font face="Arial">&nbsp;- 141</font></u></i></b>',
        'price': 432
    }
];
const Inventory = [
    {
        'search_product_name': 'product-14',
        'alcohol_type': 'Wine',
        'search_size': '400 ml',
        'search_alcohol_type': 'wine',
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'brand_name': 'Brand-1',
        'search_retailer_product_id': '0000000',
        'unit_price': 200,
        'product_name': 'Product-14',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_images': {
            'img_4': '',
            'img_2': '',
            'img_3': '',
            'img_1': 's3-1.jpg'
        },
        'createdAt': 1619691420674,
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'size': '400 ml',
        'product_id': '35250668-c06e-41ae-a38c-381d64517bbc',
        'upc_code': 1234567800,
        'retailer_product_id': '0000000',
        'search_brand_name': 'brand-1',
        'stock': 50,
        'sort_brand_name': 'brand-1',
        'updatedAt': 1619691420674
    },
    {
        'search_product_name': 'promar_20',
        'alcohol_type': 'Rum',
        'search_size': '12 ml',
        'select': true,
        'search_alcohol_type': 'rum',
        'retailer_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'brand_name': 'Brand-3',
        'search_retailer_product_id': '0000000',
        'unit_price': 20,
        'product_name': 'ProMar_20',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_images': {
            'img_2': 'product-1617089825153.jpg',
            'img_1': 'product-1617089825788.jpg'
        },
        'createdAt': 1619691420673,
        'shipping': [
            'Ground shipping',
            'Scheduled delivery'
        ],
        'size': '12 ml',
        'price': '$20',
        'product_id': '1111259b-ced8-402d-82db-db6b8e6d8cbb',
        'upc_code': 1,
        'retailer_product_id': '0000000',
        'search_brand_name': 'brand-3',
        'stock': 20.788,
        'sort_brand_name': 'brand-3',
        'updatedAt': 1619691420673
    }
];
const Markets = [{
    'id': '103',
    'name': 'Guam',
    'code': 'GU',
    'time_zone': 'Pacific/Guam',
    'updatedAt': 1630493735135,
    'createdAt': 1630493735135
}, {
    'id': '102',
    'name': 'Federated States of Micronesia',
    'code': 'FM',
    'time_zone': '',
    'updatedAt': 1630493735135,
    'createdAt': 1630493735135
}];
const PublicApiTokens = [
    {
        // secret_token bcaa8130-5472-4981-860e-636fc74539ce
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'createdAt': 1635253886660,
        'active': 1,
        'secret_token': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQFiXgstPQEPVq07OjUjaOIdAAAAgzCBgAYJKoZIhvcNAQcGoHMwcQIBADBsBgk' +
            'qhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDBk9O6In/L7XyXDZlgIBEIA/iKMWQRWHSd0ZysPIhfbzD9G0CJPK9GSagCV0HbnSjoonvqGgyy//bXsYurM0jHil61h' +
            'CfKhz1AgUi9jQfNQP',
        'updatedAt': 1635253886660
    },
    {
        // secret token 1e3fff40-4e2f-4c0f-b1e3-44e272d76f53
        'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51',
        'createdAt': 1635253889969,
        'active': 1,
        'secret_token': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQHDcy9QWcYp18PT669o/cD1AAAAgzCBgAYJKoZIhvcNAQcGoHMwcQIBADBsBgk' +
            'qhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDMpXYp5zDl6kiq588wIBEIA/sL9rJOCM5yqTrbCwuh1taA+3QeXRX6znEP1FgwrKRGwzyY2vcpHAmSIsiWO6PCNMKh' +
            'LU5KTt58MDiGLmHJ62',
        'updatedAt': 1635253889969
    }
];

const Users = [
    {
        // password 1e3fff40-4e2f-4c0f-b1e3-44e272d76f53
        'email': 'arathod@parkstreet.com',
        'status': 'pending',
        'brand_name': 'Brand-3',
        'createdAt': 1626357809338,
        'date_of_birth': 683577000000,
        'user_type': 'logedin',
        'notificationCount': 0,
        'password': 'AQICAHiafUVyo7GuP5SQmXj83AY/2fJJFVdSk2JAtzbgLftUZQHDcy9QWcYp18PT669o/cD1AAAAgzCBgAYJKoZIhvcNAQcGoHMwcQIBADBsBgk' +
        'qhkiG9w0BBwEwHgYJYIZIAWUDBAEuMBEEDMpXYp5zDl6kiq588wIBEIA/sL9rJOCM5yqTrbCwuh1taA+3QeXRX6znEP1FgwrKRGwzyY2vcpHAmSIsiWO6PCNMKh' +
        'LU5KTt58MDiGLmHJ62',
        'user_id': 'cee7e390-e575-11eb-acb4-cdde32d5fece',
        'last_name': 'Rathod',
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'profilePicture': '',
        'updatedAt': 1626357809338,
        'first_name': 'Akash',
        'customer_id': 'DTC-AKS-2D12ED',
        'phone': '8200438814',
        'brand_website': 'https://stgdtc.parkstreet.com/'
    },
    {
        'createdAt': 1636447826966,
        'phone': '9898989898',
        'user_id': '08d767bb-62a6-4ab3-9655-6028f2505ced',
        'date_of_birth': 1630434600000,
        'last_name': 'Test',
        'customer_id': 'DTC-TES-2D61ED',
        'first_name': 'Test',
        'email': 'test@gmail.com',
        'created_from': 'TP-user',
        'status': 'active',
        'updatedAt': 1636447826966
    }, {
        'createdAt': 1643810467514,
        'phone': '9898989898',
        'user_id': 'c28d2dc8-9d27-4b36-ae1d-7634de9eab6b',
        'date_of_birth': 681589800000,
        'last_name': 'Test',
        'customer_id': 'DTC-AKA-0708DA',
        'first_name': 'Test',
        'email': 'test1@gmail.com',
        'created_from': 'TP-user',
        'status': 'active',
        'updatedAt': 1643810467514
    }
];
const Products = [
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '02edf730-8d72-11eb-b782-dd03d6860089',
        'search_product_name': 'test-56',
        'product_name': 'test-56',
        'product_status': 0,
        'alcohol_type': 'Gin',
        'variants_count': 2,
        'is_catalog_product': false,
        'removed_images': [],
        'ABV': '1278',
        'updatedAt': 1637225883175,
        'sizeVariantList': [
            {
                'upc_code': 7888,
                'variant_size': 12,
                'variant_type': 'ml'
            },
            {
                'upc_code': 878888,
                'variant_size': 99,
                'variant_type': 'ml'
            }
        ],
        'product_images': {},
        'description': 'Testing',
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '07ca3eb0-8e1e-11eb-a30f-874abf28d510',
        'search_product_name': 'product-890',
        'product_name': 'Product-890',
        'product_status': 0,
        'alcohol_type': 'Gin',
        'variants_count': 1,
        'is_catalog_product': false,
        'removed_images': [],
        'ABV': '1278',
        'updatedAt': 1637225883233,
        'sizeVariantList': [
            {
                'upc_code': 98900,
                'variant_size': 10,
                'variant_type': 'ml'
            }
        ],
        'product_images': {
            'img_1': 'product-1616754499153.jpeg'
        },
        'availability_count': 0,
        'featured': 'false'
    },
    {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '083c6bb0-21fe-11ec-9fe8-5d6a8bffcd02',
        'search_product_name': 'test-789',
        'product_name': 'Test-789',
        'product_status': 0,
        'alcohol_type': 'Rum',
        'variants_count': 1,
        'is_catalog_product': false,
        'removed_images': [],
        'ABV': '12',
        'updatedAt': 1637225883352,
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
    }, {
        'brand_id': '9b9af5d1-d518-4441-9c98-9a477241ab91',
        'product_id': '099b64e0-9142-11eb-8bab-f5e971587f15',
        'search_product_name': 'sv-test-8',
        'product_name': 'SV-test-8',
        'product_status': 0,
        'alcohol_type': 'Beer',
        'variants_count': 1,
        'is_catalog_product': false,
        'ABV': '58.58',
        'updatedAt': 1637225883354,
        'sizeVariantList': [
            {
                'upc_code': 555,
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
    }
];
module.exports = {
    Retailers,
    SavedProducts,
    SavedTemplates,
    SizeVariants,
    Inventory,
    Markets,
    Users,
    Products,
    RetailersAddresses: [],
    Orders: Order,
    Public_api_tokens: PublicApiTokens
};
