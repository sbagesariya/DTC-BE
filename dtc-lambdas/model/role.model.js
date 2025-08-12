/**
 * @name Roles Model
 */
const db = require('dynamoose');

const Menu = new db.Schema({
    role_id: {
        type: String,
        trim: true,
        hashKey: true,
        required: true
    },
    role_name: {
        type: String,
        required: true,
        trim: true
    },
    role_desc: {
        type: String
    },
    role_menu: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                menu_id: {
                    type: String
                },
                menu_name: {
                    type: String
                }
            }
        }]
    },
    order_n: {
        type: Number
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
    useDocumentTypes: true,
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Roles', Menu, options);
