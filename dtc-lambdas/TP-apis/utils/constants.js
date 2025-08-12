module.exports = {
    USER_TYPE: 'TP-user',
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    TP_USER: 'TP_user',
    COSTUMER_STATUS: 'active',
    PENDING: 'Pending',
    TRAKING_COMPANY: 'Fedex',
    NAVIGATOR: {
        ORDER_STATUS:  {
            Cataloged: 'Received',
            Fulfilled: 'Shipped',
            Voided: 'Cancelled'
        }
    },
    RESPONSE_FAIL: 'Failure',
    FROM_EMAIL: 'orders@brand.parkstreet.com',
    COMPLIANCE: {
        ORDER_VALIDATE_API: '/api/v1/salesOrders/quote/compliance',
        SALES_ORDER_KEY: 'Order123',
        CUSTOMER_KEY: 'Custom123',
        SUPPLIER_TO_CONSUMER: 'SupplierToConsumer',
        SENT_TO_FULFILLMENT: 'SentToFulfillment',
        SHIPPING_SERVICE: 'FEX',
        ORDER_TYPE: 'Internet',
        PAYMENT_TYPE: 'CreditCard',
        TP: 'TP',
        SUCCESS: 'Success',
        FAIL: 'Fail',
        FAIL_ERROR_MESSAGE: 'Bed Request',
        SUCCESS_STATUS_CODE: 200
    },
    ORDER_CANCELLED: 'Cancelled',
    CURRENCY: 'USD',
    PARKSTREET_NAVIGATOR: {
        RECIPIENT_MAIL_TO: 'mdelatorre@parkstreet.com',
        CUSTOMER_TYPE: 'consumer',
        LNJ_GROUP_TOKEN: 'lnj_group_token',
        DEFAULT_PAYMENT_TERM: 'Due on receipt',
        PO_NUMBER_KEY: 'po_number',
        PO_NUMBER_PREFIX: 'DTC',
        CURRENCY_CODE: 'USD',
        SO_STATUS: 1,
        LOCATION: 'CBA Tax Paid',
        DELIVERY_TYPE: 1,
        INVOICE_WITH_SHIPMENT: 0,
        SHIPMENT_CROSSES_BORDER: 1,
        IS_SAMPLE: 0,
        ORDER_TYPE_ID: 3
    },
    NON_INVENTORY_ITEMS: {
        SHIPPING_COST_ITEM: 'MIDISTRMB',
        SALES_TAX_ITEM: 'STEXCTX',
        DEFAULT_QUANTITY: 1
    },
    PLACE_ORDER: {
        SOURCE_EMAIL: 'orders@brandname.parkstreet.com'
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
    ORDER_DELIVERED: 'Delivered',
    GET_SALES_ORDER_API_ENDPOINT: '/public_apis/get_sales_order'
};
