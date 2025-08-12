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
    company_name: {
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
    markets: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: {
                    type: String
                },
                name: {
                    type: String
                }
            }
        }]
    },
    fulfillment_options: {
        type: String,
        validate: function (v) {
            // dynamodb doesn't support enum for that added validation to support specific keys only
            return ['product', 'market'].indexOf(v) > -1;
        }
    },
    product_retail_network: {
        type: Array
    },
    product_fulfillment_center: {
        type: Array
    },
    market_retail_network: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: {
                    type: String
                },
                name: {
                    type: String
                }
            }
        }]
    },
    market_fulfillment_center: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                id: {
                    type: String
                },
                name: {
                    type: String
                }
            }
        }]
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
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Brands', Brands, options);
