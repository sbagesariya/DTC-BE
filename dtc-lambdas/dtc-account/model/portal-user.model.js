/**
 * @name PrtalUser Model
 * @author Innovify
 */
const db = require('dynamoose');

const PortalUser = new db.Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        hashKey: true,
        unique: true,
        validate: function (v) {
            return v !== null;
        }
    },
    user_id: {
        type: String,
        trim: true,
        required: true,
        validate: function (v) {
            return v !== null;
        }
    },
    profilePicture: {
        type: String,
        default: ''
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    user_type: {
        type: String,
        required: true,
        default: 'brand',
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['brand', 'retailer'].indexOf(v) > -1;
        }
    },
    created_by: {
        type: String
    },
    user_roles: {
        type: Object,
        schema: {
            administrator: {
                type: Boolean
            },
            manager: {
                type: Boolean
            },
            information: {
                type: Boolean
            },
            developer: {
                type: Boolean
            }
        }
    },
    date_of_birth: {
        type: Date,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'pending',
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['active', 'pending'].indexOf(v) > -1;
        }
    },
    notification_count: {
        type: Number,
        default: 0
    },
    is_temporary_password: {
        type: Boolean
    },
    max_product_count: {
        type: Number,
        default: 3
    },
    stripe_connect_account: {
        type: String
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
    create: false,
    update: false,
    throughput: 100,
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Portal_users', PortalUser, options);
