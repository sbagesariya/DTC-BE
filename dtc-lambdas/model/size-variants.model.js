/**
 * @name Menu Model
 * @author Innovify
 */
const db = require('dynamoose');

const Menu = new db.Schema({
    product_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    variant_id: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
    },
    brand_id: {
        type: String,
        required: true,
        index: {
            global: true,
            name: 'brand_id-index',
            project: 'All'
        }
    },
    product_name: {
        type: String
    },
    alcohol_type: {
        type: String
    },
    upc_code: {
        type: Number
    },
    variant_size: {
        type: Number
    },
    variant_type: {
        type: String
    },
    sku_code: {
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

var options = {
    create: false,
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

module.exports = db.model('Size_variants', Menu, options);
