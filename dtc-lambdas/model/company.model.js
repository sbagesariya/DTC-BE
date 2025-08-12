/**
 * @name Company Model
 * @author Innovify
 */
const db = require('dynamoose');

const Company = new db.Schema({
    company_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    company_name: {
        type: String,
        required: true
    },
    company_logo: {
        type: String
    },
    description: {
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
    throughput: { 'read': 20, 'write': 10 },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Company', Company, options);
