/**
 * @name Cart Model
 * @author Innovify
 */
const db = require('dynamoose');

const Cart = new db.Schema({
    cart_id: {
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
    brand_id: {
        type: String,
        trim: true,
        required: true
    },
    product_details: {
        type: Array,
        required: true,
        schema: [{
            type: Object,
            required: true,
            schema: {
                retailer_id: {
                    type: String
                },
                fulfillment_center_id: {
                    type: String
                },
                product_id: {
                    type: String,
                    required: true
                },
                product_name: {
                    type: String,
                    required: true
                },
                product_img: {
                    type: String
                },
                price: {
                    type: Number,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                },
                size: {
                    type: String
                },
                sku_code: {
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

module.exports = db.model('Cart', Cart, options);
