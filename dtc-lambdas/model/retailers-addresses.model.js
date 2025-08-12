/**
 * @name RetailersAddresses Model
 *
 */
const db = require('dynamoose');

const RetailersAddresses = new db.Schema({
    retailer_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    address_id: {
        type: String
    },
    is_shipping_limit: {
        type: Boolean
    },
    shipping_limit: {
        type: Object,
        schema: {
            zipcode: {
                type: String
            },
            state: {
                type: String
            },
            lat: {
                type: String
            },
            lng: {
                type: String
            }
        }
    },
    address: {
        type: Object,
        schema: {
            address_line_1: {
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
            street: {
                type: String
            },
            country: {
                type: String
            },
            zipcode: {
                type: String
            },
            lat: {
                type: String
            },
            lng: {
                type: String
            }
        }
    },
    createdAt: {
        type: Date,
        default: new Date(),
        required: true,
        rangeKey: true

    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

var options = {
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

module.exports = db.model('Retailers_addresses', RetailersAddresses, options);
