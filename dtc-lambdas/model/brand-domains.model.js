/**
 * @name BrandDomains Model
 */
const db = require('dynamoose');

const BrandDomains = new db.Schema({
    domain_id: {
        type: String,
        required: true
    },
    brand_id: {
        type: String,
        hashKey: true,
        required: true
    },
    app_id: {
        type: String,
        required: true
    },
    domain_name: {
        type: String,
        required: true
    },
    assigned_by: {
        type: String
    },
    status: {
        type: String
    },
    order_n: {
        type: Number
    },
    createdAt: {
        type: Date,
        default: new Date(),
        rangeKey: true
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

module.exports = db.model('Brand_domains', BrandDomains, options);
