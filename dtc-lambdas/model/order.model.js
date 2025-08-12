/**
 * @name Order Model
 * @author Innovify
 */
const db = require('dynamoose');

const Order = new db.Schema({
    order_id: {
        type: String,
        trim: true,
        required: true,
        validate: function (v) {
            return v !== null;
        },
        index: {
            global: true,
            name: 'order_id-index',
            project: 'All'
        }
    },
    po_number: {
        type: String,
        index: {
            global: true,
            name: 'po_number-index',
            project: 'All'
        }
    },
    user_email: {
        type: String,
        required: true,
        lowercase: true,
        index: {
            global: true,
            name: 'user_email-index',
            project: 'All'
        }
    },
    user_detail: {
        type: Object,
        schema: {
            phone: {
                type: String,
                required: true
            },
            first_name: {
                type: String,
                required: true
            },
            last_name: {
                type: String,
                required: true
            },
            user_type: {
                type: String,
                required: true,
                default: 'guest'
            },
            date_of_birth: {
                type: String
            }
        }
    },
    delivery_address: {
        type: Object,
        schema: {
            first_name: {
                type: String
            },
            last_name: {
                type: String
            },
            address_line_1: {
                type: String
            },
            address_line_2: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String
            },
            zip_code: {
                type: String
            },
            street: {
                type: String
            }
        }
    },
    billing_address: {
        type: Object,
        schema: {
            first_name: {
                type: String
            },
            last_name: {
                type: String
            },
            address_line_1: {
                type: String
            },
            address_line_2: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String
            },
            zip_code: {
                type: String
            },
            street: {
                type: String
            }
        }
    },
    payment_detail: {
        type: Object,
        schema: {
            stripe_payment_method: {
                type: String
            },
            stripe_payment_intent_id: {
                type: String
            },
            stripe_payment_secret: {
                type: String
            },
            sub_total: {
                type: String
            },
            discount: {
                type: String
            },
            shipping_charge: {
                type: String
            },
            tax: {
                type: String
            },
            total: {
                type: String
            },
            promo_code: {
                type: String
            },
            credit_card_fee: {
                type: String
            }
        }
    },
    brand_id: {
        type: String,
        required: true,
        hashKey: true
    },
    brand_name: {
        type: String,
        required: true
    },
    product_detail: {
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
                name: {
                    type: String,
                    required: true
                },
                desc: {
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
                credit_card_fee: {
                    type: String
                },
                sku_code: {
                    type: String
                },
                createdAt: {
                    type: Date
                }
            }
        }]
    },
    payment_id: {
        type: String
    },
    order_status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Confirmed', 'Received', 'Packed', 'Shipped', 'Delivered', 'Completed', 'Cancelled']
    },
    instructions: {
        type: String
    },
    gift_note: {
        type: String
    },
    newsletter: {
        type: Boolean
    },
    search_order_id: {
        type: String
    },
    search_user_name: {
        type: String
    },
    search_placed_on: {
        type: String
    },
    search_state: {
        type: String
    },
    search_total: {
        type: Number
    },
    search_retailer: {
        type: String
    },
    sort_state: {
        type: String
    },
    sort_total: {
        type: Number
    },
    sort_order_id: {
        type: String
    },
    retailer: {
        type: String
    },
    estimated_delivery_date: {
        type: Date
    },
    search_estimated_delivery_date: {
        type: String
    },
    requested_delivery_date: {
        type: Date
    },
    search_brand_name: {
        type: String
    },
    sort_brand_name: {
        type: String
    },
    search_status: {
        type: String
    },
    retailer_id: {
        type: String,
        index: {
            global: true,
            name: 'retailer_id-index',
            project: 'All'
        }
    },
    fulfillment_center_id: {
        type: String
    },
    payment_status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Paid', 'Refund']
    },
    refund_info: {
        type: Object
    },
    transaction_type: {
        type: String
    },
    payment_date: {
        type: Date
    },
    fulfillment_types: {
        type: String
    },
    confirmation_order_number: {
        type: String
    },
    created_from: {
        type: String
    },
    order_notes: {
        type: String
    },
    tracking_company: {
        type: String
    },
    tracking_id: {
        type: String
    },
    nav_error_msg: {
        type: String
    },
    nav_error_code: {
        type: Number
    },
    fulfillment_center: {
        type: String
    },
    domain_name: {
        type: String
    },
    sales_order_id: {
        type: String
    },
    payment_confirmation_number: {
        type: String
    },
    refund_confirmation_number: {
        type: String
    },
    createdAt: {
        type: Date,
        rangeKey: true,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    }
});

const options = {
    create: true,
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

module.exports = db.model('Order', Order, options);
