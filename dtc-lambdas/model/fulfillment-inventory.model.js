/**
 * @name FulfillmentInventory Model
 */
const db = require('dynamoose');

const FulfillmentInventory = new db.Schema({
    fulfillment_center_id: {
        type: String,
        required: true,
        hashKey: true
    },
    product_id: {
        type: String,
        required: true
    },
    fulfillment_product_id: {
        type: String
    },
    brand_id: {
        type: String,
        index: {
            global: true,
            name: 'brand_id-index',
            project: 'All'
        }
    },
    product_name: {
        type: String
    },
    brand_name: {
        type: String
    },
    alcohol_type: {
        type: String
    },
    size: {
        type: String
    },
    upc_code: {
        type: Number
    },
    unit_price: {
        type: Number
    },
    stock: {
        type: Number
    },
    search_stock: {
        type: String
    },
    search_product_name: {
        type: String,
        trim: true
    },
    search_brand_name: {
        type: String,
        trim: true
    },
    sort_brand_name: {
        type: String,
        trim: true
    },
    search_fulfillment_product_id: {
        type: String
    },
    search_alcohol_type: {
        type: String
    },
    search_size: {
        type: String
    },
    product_images: {
        type: Object,
        schema: {
            img_1: {
                type: String
            },
            img_2: {
                type: String
            },
            img_3: {
                type: String
            },
            img_4: {
                type: String
            }
        }
    },
    unit_price_per_market: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                price: {
                    type: Number
                },
                states: {
                    type: Array,
                    schema: [{
                        type: Object,
                        schema: {
                            id: {
                                type: String
                            },
                            name: {
                                type: String
                            }
                        }
                    }]
                }
            }
        }]
    },
    shipping: {
        type: Array,
        schema: [String]
    },
    sku_code: {
        type: String
    },
    description: {
        type: String
    },
    search_sku_code: {
        type: String
    },
    warehouse: {
        type: String
    },
    location_group: {
        type: String
    },
    location: {
        type: String
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
        rangeKey: true
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

const options = {
    create: false,
    update: true,
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Fulfillment_inventory', FulfillmentInventory, options);
