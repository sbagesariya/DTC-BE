/**
 * @name PublicApiToken Model
 * @author Growexx
 */
const db = require('dynamoose');

const PublicApiToken = new db.Schema({
    id: {
        type: String,
        trim: true
    },
    brand_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    active: {
        type: Number,
        default: 1
    },
    secret_token: {
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

module.exports = db.model('Public_api_tokens', PublicApiToken, options);
