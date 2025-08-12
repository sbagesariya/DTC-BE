module.exports = {
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/
    },
    GET_ORDER_API_LIMIT: 10,
    STANDARD_EST_DEL_DATE: 3,
    PLACE_ORDER: {
        SOURCE_EMAIL: 'orders@brandname.parkstreet.com',
        PAYMENT_STATUS: 'Pending',
        ORDER_STATUS: 'Pending'
    },
    PRODUCT_DEFAULT_IMG: 'https://dtc-stg-public.s3.amazonaws.com/product_default.png',
    CREDIT_CARD_FEE: 3,
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
    COMPLIANCE: {
        ORDER_VALIDATE_API: '/api/v1/salesOrders/quote/compliance',
        TAX_SALE_TYPE: 'onsite',
        SALES_ORDER_KEY: 'Order123',
        CUSTOMER_KEY: 'Custom123',
        SUPPLIER_TO_CONSUMER: 'SupplierToConsumer',
        SENT_TO_FULFILLMENT: 'SentToFulfillment',
        SHIPPING_SERVICE: 'FEX',
        ORDER_TYPE: 'Internet',
        SUCCESS: 'Success',
        FAIL: 'Fail',
        FAIL_ERROR_MESSAGE: 'Bed Request',
        SUCCESS_STATUS_CODE: 200,
        DTC: 'DTC'
    },
    FULFILLMENT_CENTER_NAME: 'Park Street Fulfillment Center',
    PAYMENT_AUTHORISE: 'Authorise',
    TABLE_INVENTOTY: 'Inventory',
    TABLE_FC_INVENTORY: 'Fulfillment_inventory'
};
