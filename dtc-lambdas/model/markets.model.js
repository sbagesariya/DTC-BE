/**
 * @name Markets Model
 */
const db = require('dynamoose');

const Markets = new db.Schema({
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
    code: {
        type: String
    },
    time_zone: {
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
    throughput: {
        read: 10,
        write: 10
    },
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
};

module.exports = db.model('Markets', Markets, options);
