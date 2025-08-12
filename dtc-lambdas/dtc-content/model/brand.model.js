/**
 * @name Brands Model
 * @author Innovify
 */
const db = require('dynamoose');

const Brands = new db.Schema({
    brand_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    brand_name: {
        type: String
    },
    company_id: {
        type: String
    },
    compnay_name: {
        type: String
    },
    heading_images: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                img: String,
                url: String
            }
        }]
    },
    brand_logo: {
        type: String
    },
    heading_text: {
        type: String
    },
    brand_website: {
        type: String
    },
    search_brand_name: {
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
    throughput: { 'read': 10, 'write': 10 },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Brands', Brands, options);
