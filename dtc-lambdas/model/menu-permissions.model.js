/**
 * @name MenuPermissions Model
 * @author Innovify
 */
const db = require('dynamoose');
const UUID = require('uuid');
const menuSchema = [{
    type: Object,
    schema: {
        menu_id: {
            type: String,
            trim: true,
            default: UUID.v1()
        },
        menu_category: {
            type: String,
            default: 'brand',
            validate: function (v) {
                // dynamodb doesn't support enum for that added validation to support specific keys only
                return ['brand', 'development', 'retailer'].indexOf(v) > -1;
            }
        },
        menu_name: {
            type: String
        },
        menu_description: {
            type: String
        },
        menu_link: {
            type: String
        },
        menu_icon: {
            type: String
        },
        parent_id: {
            type: String
        },
        order_n: {
            type: Number,
            default: 1
        }
    }
}];

const MenuPermissions = new db.Schema({
    id: {
        type: String,
        trim: true,
        required: true
    },
    user_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    menu_items: {
        type: Array,
        schema: menuSchema
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
    throughput:  { read: 10, write: 10 },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Menu_permissions', MenuPermissions, options);
