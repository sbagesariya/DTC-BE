/**
 * @name Menu Model
 * @author Innovify
 */
const db = require('dynamoose');

const Menu = new db.Schema({
    menu_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    menu_category: {
        type: String,
        required: true,
        default: 'brand',
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['brand', 'development'].indexOf(v) > -1;
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
    waitForActive: true,
    waitForActiveTimeout: 1000,
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Menu', Menu, options);
