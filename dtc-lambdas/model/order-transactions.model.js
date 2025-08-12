/**
 * @name OrderTransactions Model
 */
const db = require('dynamoose');

const OrderTransactions = new db.Schema({
    transaction_id: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
    },
    user_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    orders: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                order_id: {
                    type: String
                }
            }
        }]
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

module.exports = db.model('Order_transactions', OrderTransactions, options);
