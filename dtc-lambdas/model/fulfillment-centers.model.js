/**
 * @name FulfillmentCenters Model
 *
 */
const db = require('dynamoose');

const FulfillmentCenters = new db.Schema({
    brand_id: {
        type: String,
        hashKey: true,
        trim: true,
        required: true
    },
    fulfillment_center_id: {
        type: String,
        trim: true,
        required: true,
        rangeKey: true
    },
    fulfillment_center_name: {
        type: String
    },
    primary_contact_number: {
        type: String
    },
    primary_email_address: {
        type: String
    },
    is_fulfillment_center: {
        type: Boolean
    },
    primary_address: {
        type: Object,
        schema: {
            address_line_1: {
                type: String
            },
            address_line_2: {
                type: String
            },
            city: {
                type: String
            },
            state: {
                type: String
            },
            zipcode: {
                type: String
            },
            lat: {
                type: String
            },
            lng: {
                type: String
            }
        }
    },
    shipping_zones_rates: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                name: {
                    type: String
                },
                rate: {
                    type: Number
                },
                states: {
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

module.exports = db.model('Fulfillment_centers', FulfillmentCenters, options);
