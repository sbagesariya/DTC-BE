/**
 * @name Product Model
 * @author Innovify
 */
const db = require('dynamoose');

const Products = new db.Schema({
    product_id: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
    },
    brand_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    origin: {
        type: String
    },
    size: {
        type: Array,
        schema: [String]
    },
    product_name: {
        type: String
    },
    search_product_name: {
        type: String,
        trim: true
    },
    description: {
        type: String
    },
    alcohol_type: {
        type: String
    },
    large_image: {
        type: String
    },
    is_catalog_product: {
        type: Boolean
    },
    shipping: {
        type: Array,
        schema: [String]
    },
    ABV: {
        type: String
    },
    available_address: {
        type: Object,
        schema: {
            address_line_1: {
                type: String
            },
            country: {
                type: String
            },
            address_line_2: {
                type: String
            },
            state: {
                type: String
            },
            city: {
                type: String
            },
            zip_code: {
                type: String
            }
        }
    },
    tasting_notes: {
        type: Array,
        schema: [String]
    },
    product_type: {
        type: String
    },
    small_image: {
        type: String
    },
    price: {
        type: Number
    },
    featured: {
        type: String
    },
    price_matrix: {
        type: Object
    },
    qty: {
        type: Number
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
    availability_count: {
        type: Number,
        default: 0
    },
    variants_count: {
        type: Number,
        default: 0
    },
    product_status: {
        type: Number,
        default: 0,
        enum: [0, 1, 2] // 0 => Pending, 1 => Active, 2 => Live
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

var options = {
    create: false,
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

module.exports = db.model('Products', Products, options);

