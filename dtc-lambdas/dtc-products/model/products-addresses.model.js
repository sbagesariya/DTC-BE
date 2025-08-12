/**
 * @name ProductAddresses Model
 * @author Innovify
 */
const db = require('dynamoose');

const ProductAddresses = new db.Schema({
    address_id: {
        type: String,
        trim: true
    },
    brand_id: {
        type: String,
        trim: true,
        hashKey: true,
        required: true
    },
    product_id: {
        type: String,
        trim: true,
        required: true
    },
    product_name: {
        type: String
    },
    description: {
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
    createdAt: {
        type: Date,
        default: new Date(),
        rangeKey: true,
        trim: true,
        required: true
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

module.exports = db.model('Products_addresses', ProductAddresses, options);
