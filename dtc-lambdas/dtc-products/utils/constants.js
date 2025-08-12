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
    PRODUCT_CHUNK_SIZE: 25,
    ES: {
        PRODUCT_FIELDS: [
            'product_name',
            'select',
            'alcohol_type',
            'retailer_id',
            'fulfillment_center_id',
            'brand_name',
            'unit_price',
            'brand_id',
            'createdAt',
            'product_id',
            'upc_code',
            'retailer_product_id',
            'shipping',
            'product_images',
            'stock',
            'updatedAt',
            'description'
        ]
    },
    FULFILLMENT_OPTION: 'product',
    FULFILLMENT_OPTION_MARKET: 'market',
    TABLE_INVENTOTY: 'Inventory',
    TABLE_FC_INVENTORY: 'Fulfillment_inventory',
    FC_ID: 'd3d9d076-ecf5-4ec4-b7f3-5f967b9d6404',
    API: {
        UPDATE_PRODUCT_INVENTORY: '/product/update-inventory'
    },
    DUPLICATE_PRODUCT_VARIANT: 'The product code you’ve entered already exists. ' +
        'Product code is a unique identifier, so no duplicate product codes are allowed.',
    FULFILLMENT_OPTION: {
        PRODUCT: 'product',
        MARKET: 'market'
    },
    REQUEST_TYPE: {
        RETAILER: 'retailer',
        FULFILLMENT: 'fulfillment'
    }
};
