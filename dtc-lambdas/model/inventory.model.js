/**
 * @name Inventory Model
 */
const db = require('dynamoose');

const Inventory = new db.Schema({
    retailer_id: {
        type: String,
        required: true,
        hashKey: true
    },
    product_id: {
        type: String,
        required: true
    },
    retailer_product_id: {
        type: String
    },
    brand_id: {
        type: String
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
    search_retailer_product_id: {
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
    sku_code: {
        type: String
    },
    shipping: {
        type: Array,
        schema: [String]
    },
    description: {
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
    create: true,
    update: false,
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Inventory', Inventory, options);
