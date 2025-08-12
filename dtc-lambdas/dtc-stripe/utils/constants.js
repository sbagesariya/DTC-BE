module.exports = {
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    GET_ORDER_API_LIMIT: 10,
    STANDARD_EST_DEL_DATE: 5,
    FULFILLMENT_OPTIONS: {
        MARKET: 'market',
        PRODUCT: 'product'
    },
    PRODUCT: {
        TAX: 12
    },
    DECIMAL_TWO: 2,
    SHIPPING_OPTION: 2,
    CREDIT_CARD_FEE: 3,
    PARKSTREET_NAVIGATOR: {
        PO_NUMBER_KEY: 'po_number',
        PO_NUMBER_PREFIX: 'DTC',
        CUSTOMER_TYPE: 'consumer',
        LNJ_GROUP_TOKEN: 'lnj_group_token',
        DEFAULT_PAYMENT_TERM: 'Due on Receipt'
    },
    STRIPE: {
        CURRENCY: 'usd',
        DESCRIPTION: 'DTC Parkstreet Place Order',
        PAYMENT_METHOD_TYPE: 'card'
    },
    STATUS_PENDING: 'pending',
    USER_TYPE: 'DTC-user',
    ORDER: {
        RETAILER: 'Retailer'
    }
};
