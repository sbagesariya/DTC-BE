module.exports = {
    MARKET_PRODUCT_REQ: {
        SOURCE_EMAIL: 'dtc.request@parkstreet.com',
        PARKSTREET_TEAM: 'dtc.brandrequests@parkstreet.com'
    },
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    FULFILLMENT_OPTIONS: {
        MARKET: 'market',
        PRODUCT: 'product'
    },
    MARKET: 'market',
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
        }
    },
    ALPHABETS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    FULFILLMENT_INVENTORY_API_ENDPOINT: '/product/add-fulfillment-inventory-product'
};
