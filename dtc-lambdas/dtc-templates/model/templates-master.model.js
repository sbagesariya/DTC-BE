/**
 * @name TemplateMaster Model
 * @author Innovify
 */
const db = require('dynamoose');

const TemplateMaster = new db.Schema({
    template_id: {
        type: String,
        trim: true,
        required: true,
        hashKey: true
    },
    banner_link: {
        type: String
    },
    featured_product_id: {
        type: String
    },
    featured_product: {
        type: String
    },
    featured_products_description: {
        type: String
    },
    logo: {
        type: String
    },
    template_name: {
        type: String
    },
    back_to_main_page_hover_color: {
        type: String
    },
    back_to_main_page_url: {
        type: String
    },
    company: {
        type: String
    },
    companyurl: {
        type: String
    },
    policy: {
        type: String
    },
    term_url: {
        type: String
    },
    terms_and_policy_hover_color: {
        type: String
    },
    template_background: {
        type: String
    },
    template_heading_text_color: {
        type: String
    },
    template_subsection_product_text_color: {
        type: String
    },
    brand_website: {
        type: String
    },
    is_default: {
        type: Boolean,
        default: false
    },
    logo_alt_text: {
        type: String
    },
    favicon: {
        type: String
    },
    favicon_alt_text: {
        type: String
    },
    color_text: {
        type: Object,
        schema: {
            heading_links: {
                type: String
            },
            subheading: {
                type: String
            },
            body_text: {
                type: String
            }
        }
    },
    color_button: {
        type: Object,
        schema: {
            background: {
                type: String
            },
            text: {
                type: String
            },
            border: {
                type: String
            },
            hover_color: {
                type: String
            }
        }
    },
    color_background: {
        type: Object,
        schema: {
            header_footer: {
                type: String
            },
            section: {
                type: String
            }
        }
    },
    color_annoucement_bar: {
        type: Object,
        schema: {
            bar: {
                type: String
            },
            text: {
                type: String
            }
        }
    },
    typography_heading: {
        type: Object,
        schema: {
            font_family: {
                type: String
            },
            font_style: {
                type: String
            }
        }
    },
    typography_subheading: {
        type: Object,
        schema: {
            font_family: {
                type: String
            },
            font_style: {
                type: String
            }
        }
    },
    typography_body: {
        type: Object,
        schema: {
            font_family: {
                type: String
            },
            font_style: {
                type: String
            }
        }
    },
    template_img_full: {
        type: String
    },
    template_img_half: {
        type: String
    },
    template_description: {
        type: String
    },
    template_features: {
        type: [String],
        get: (value) => JSON.parse(value)
    },
    min_content_product: {
        type: Number
    },
    max_content_product: {
        type: Number
    },
    min_content_card_limit: {
        type: Number
    },
    max_content_card_limit: {
        type: Number
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
    create: false,
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
module.exports = db.model('Template_master', TemplateMaster, options);
