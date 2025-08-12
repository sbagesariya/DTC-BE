/**
 * @name AlcoholType Model
 * @author Innovify
 */
const db = require('dynamoose');

const AlcoholType = new db.Schema({
    id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    name: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
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

module.exports = db.model('Alcohol_type', AlcoholType, options);
