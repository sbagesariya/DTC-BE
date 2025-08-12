/**
 * @name Auto_increment Model
 * @author GrowExx
 */
const db = require('dynamoose');

const AutoIncrement = new db.Schema({
    id: {
        type: String,
        required: true
    },
    increment_type: {
        type: String,
        required: true,
        hashKey: true
    },
    increment_number: {
        type: Number,
        default: 200001
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
    update: true,
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

module.exports = db.model('Auto_increment', AutoIncrement, options);
