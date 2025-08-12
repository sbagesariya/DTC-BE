module.exports = {
    PRODUCT_FILTER_SORT_BY: [{
        'id': 1,
        'name': 'Featured'
    }, {
        'id': 2,
        'name': 'Price: Lowest to Highest'
    }, {
        'id': 3,
        'name': 'Price: Highest to Lowest'
    }],
    SHIPPING_OPTION: 2,
    DECIMAL_TWO: 2,
    COMPLIANCE: {
        TAX_SALE_TYPE: 'onsite',
        SUCCESS: 'Success',
        FAIL: 'Fail',
        FAIL_ERROR_MESSAGE: 'Bed Request',
        DTC: 'DTC',
        SUCCESS_STATUS_CODE: 200,
        SALES_TAX_ENDPOINT: '/api/v1/salesOrders/quote/sales-tax'
    }
};
