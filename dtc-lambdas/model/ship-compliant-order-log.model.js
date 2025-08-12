/**
 * @name ShipCompliantOrderLog Model
 * @author Innovify
 */
const db = require('dynamoose');

const ShipCompliantOrderLog = new db.Schema({
    log_id: {
        type: String,
        required: true,
        rangeKey: true
    },
    brand_id: {
        type: String,
        required: true,
        hashKey: true,
        validate: function (v) {
            return v !== null;
        }
    },
    products: {
        type: Object,
        schema: {
            id: {
                type: String
            },
            sku_code: {
                type: String
            },
            size: {
                type: String
            },
            qty: {
                type: String
            },
            price: {
                type: String
            }
        }
    },
    sub_total: {
        type: String
    },
    shipping: {
        type: String
    },
    tax: {
        type: String
    },
    total: {
        type: String
    },
    customer_email: {
        type: String
    },
    api_response_code: {
        type: String
    },
    api_message: {
        type: String
    },
    api_request: {
        type: Object
    },
    api_response: {
        type: Array
    },
    status: {
        type: String,
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['Success', 'Fail'].indexOf(v) > -1;
        }
    },
    created_from: {
        type: String,
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['DTC', 'TP'].indexOf(v) > -1;
        }
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

module.exports = db.model('ship_compliant_order_log', ShipCompliantOrderLog, options);
