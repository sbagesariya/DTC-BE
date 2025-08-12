/**
 * @name BrandRecipes Model
 * @author Innovify
 */
const db = require('dynamoose');

const BrandRecipes = new db.Schema({
    brand_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    recipe_id: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
    },
    content_section_heading: {
        type: String
    },
    content_section_type: {
        type: Number // 1 Card, 2 Product
    },
    card_image: {
        type: String
    },
    card_body: {
        type: String
    },
    product_id: {
        type: String
    },
    saved_content_section_heading: {
        type: String
    },
    saved_content_section_type: {
        type: Number
    },
    saved_card_image: {
        type: String
    },
    saved_card_body: {
        type: String
    },
    saved_product_id: {
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
    create: true,
    update: false,
    waitForActive: true,
    useDocumentTypes: true,
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

module.exports = db.model('Brand_recipes', BrandRecipes, options);
