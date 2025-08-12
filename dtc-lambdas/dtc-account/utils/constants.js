module.exports = {
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    CREATE_ACCOUNT: {
        SOURCE_EMAIL: 'orders@dzamarum.parkstreet.com'
    },
    RESET_PASSWORD: {
        SOURCE_EMAIL: 'noreply@parkstreet.com'
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
    DEFAULT_PRODUCT_COUNT: 20,
    DEFAULT_MARKET_COUNT: 5
};
