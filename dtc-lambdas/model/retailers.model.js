/**
 * @name Retailers Model
 *
 */
const db = require('dynamoose');

const Retailers = new db.Schema({
    retailer_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    retailer_name: {
        type: String
    },
    shipping_option: {
        type: Number,
        default: 3,
        enum: [1, 2, 3] /** 1= flat, 2 = tier, 3 = zero */
    },
    ship_rate_flat_amount: {
        type: Number
    },
    shipping_tier: {
        type: Array,
        schema: [{
            type: Object,
            schema: {
                tier_id: {
                    type: String
                },
                tier_order: {
                    type: Number
                },
                tier_starts: {
                    type: Number
                },
                tier_ends: {
                    type: Number
                },
                tier_amount: {
                    type: Number
                }
            }
        }]
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
            state: {
                type: String
            },
            city: {
                type: String
            },
            street: {
                type: String
            },
            country: {
                type: String
            },
            lat: {
                type: String
            },
            long: {
                type: String
            }
        }
    },
    relationship: {
        type: Object,
        schema: {
            title: {
                type: String
            },
            owner: {
                type: Boolean
            },
            representative: {
                type: Boolean
            },
            percent_ownership: {
                type: String
            }
        }
    },
    ssn_last_4: {
        type: String
    },
    verification_document: {
        type: Object,
        schema: {
            front: {
                type: String
            },
            back: {
                type: String
            }
        }
    },
    capabilities: {
        type: Object,
        schema: {
            card_payments: {
                type: Boolean
            },
            transfers: {
                type: Boolean
            }
        }
    },
    external_account: {
        type: Object,
        schema: {
            object: {
                type: String
            },
            country: {
                type: String
            },
            currency: {
                type: String
            },
            routing_number: {
                type: String
            },
            account_number: {
                type: String
            }
        }
    },
    company: {
        type: Object,
        schema: {
            name: {
                type: String
            },
            phone: {
                type: String
            },
            tax_id: {
                type: String
            },
            owners_provided: {
                type: Boolean
            }
        }
    },
    company_address: {
        type: Object,
        schema: {
            city: {
                type: String
            },
            country: {
                type: String
            },
            line1: {
                type: String
            },
            line2: {
                type: String
            },
            postal_code: {
                type: String
            },
            state: {
                type: String
            }
        }
    },
    business_profile: {
        type: Object,
        schema: {
            url: {
                type: String
            },
            mcc: {
                type: String // 5921
            },
            name: {
                type: String
            },
            support_email: {
                type: String
            },
            support_phone: {
                type: String
            },
            support_url: {
                type: String
            }
        }
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

module.exports = db.model('Retailers', Retailers, options);
