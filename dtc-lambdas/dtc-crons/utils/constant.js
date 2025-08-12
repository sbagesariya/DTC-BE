module.exports = {
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    PARKSTREET_FULFILLMENT_CENTER: {
        fulfillment_center_name: 'Park Street Fulfillment Center',
        primary_contact_number: '',
        primary_email_address: 'orders@brand.parkstreet.com',
        primary_address: {
            address_line_1: '1000 Brickell Ave',
            city: 'Miami',
            address_line_2: '',
            state: 'Florida',
            zipcode: '33131'
        },
        fulfillment_center_id: 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
        is_fulfillment_center: true
    },
    PARKSTREET_NAVIGATOR: {
        LNJ_GROUP_TOKEN: 'lnj_group_token'
    },
    COMMON: {
        SOMETHING_WENT_WRONG: 'Something went wrong!',
        TABLE_NOT_FOUND: 'Invalid table name',
        INSERTED_SUCCESSFULLY: 'Inserted successfully',
        REMOVED_SUCCESSFULLY: 'Removed successfully',
        UPDATED_SUCCESSFULLY: 'Updated successfully',
        STANDARD_EST_DEL_DATE: 3
    },
    TEMPLATE_1: {
        NAME: 'Debut Template',
        MIN_PRODUCT_LIMIT: 1,
        MAX_PRODUCT_LIMIT: 3,
        MIN_CONTENT_CARD_LIMIT: 1,
        MAX_CONTENT_CARD_LIMIT: 3
    },
    TEMPLATE_2: {
        NAME: 'Basic Template',
        MIN_PRODUCT_LIMIT: 3,
        MAX_PRODUCT_LIMIT: 999999
    },
    TEMPLATE_3: {
        NAME: 'Menu Template',
        MIN_PRODUCT_LIMIT: 1,
        MAX_PRODUCT_LIMIT: 999999
    },
    TEMPLATE_4: {
        NAME: 'Solo Template',
        MIN_PRODUCT_LIMIT: 1,
        MAX_PRODUCT_LIMIT: 1
    },
    TEMPLATE_5: {
        NAME: 'Recipe Template',
        MIN_PRODUCT_LIMIT: 3,
        MAX_PRODUCT_LIMIT: 6,
        MIN_CONTENT_CARD_LIMIT: 1,
        MAX_CONTENT_CARD_LIMIT: 6
    },
    FULFILLMENT_CENTER_ID: 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
    FULFILLMENT_OPTION: 'product',
    CBA_WAREHOUSE: 'CA Convoy Beverage Alliance',
    API: {
        UPDATE_PRODUCT_INVENTORY: '/product/update-inventory'
    },
    FULFILLMENT_INVENTORY: 'Fulfillment_inventory',
    NAVIGATOR: {
        ORDER_STATUS:  {
            Cataloged: 'Received',
            Fulfilled: 'Shipped',
            Voided: 'Cancelled'
        }
    },
    ORDER_CANCELLED: 'Cancelled',
    ORDER_DELIVERED: 'Delivered',
    GET_SALES_ORDER_API_ENDPOINT: '/public_apis/get_sales_order',
    CURRENCY: 'USD',
    FROM_EMAIL: 'orders@brand.parkstreet.com'
};
