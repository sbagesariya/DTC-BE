/**
 * @name PortalUser Model
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
    notificationCount: {
        type: Number,
        default: 0
    },
    is_temporary_password: {
        type: Boolean
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
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Portal_users', PortalUser, options);
