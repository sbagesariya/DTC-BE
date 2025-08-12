/**
 * @name PromoCode Model
 * @author Innovify
 */
const db = require('dynamoose');

const PromoCode = new db.Schema({
    promo_id: {
        type: String,
        trim: true
    },
    promo_code: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    promo_discount: {
        type: Number
    },
    promo_expiry: {
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
    useDocumentTypes: true,
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

module.exports = db.model('Promo_code', PromoCode, options);
