/**
 * @name Permission Model
 * @author Innovify
 */
const db = require('dynamoose');

const Permission = new db.Schema({
    user_type: {
        type: String,
        required: true,
        hashKey: true,
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['Retailer', 'Brand', 'Normal'].indexOf(v) > -1;
        }
    },
    resource: {
        type: String,
        require: true
    },
    allows: {
        type: Object,
        schema: {
            can_view: {
                type: Boolean
            },
            can_add: {
                type: Boolean
            },
            can_edit: {
                type: Boolean
            },
            can_delete: {
                type: Boolean
            }
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

module.exports = db.model('Permissions', Permission, options);
