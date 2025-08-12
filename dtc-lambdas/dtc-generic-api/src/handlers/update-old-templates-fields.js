const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Constant = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class UpdateOldTemplatesFields {

    /**
    * @desc This function is being used to update old templates fields
    */
    async updateOldTemplatesFields (req, context, callback) {
        try {
            this.updateEmptyOldTemplatesFields('Template_master');
            this.updateEmptyOldTemplatesFields('Saved_templates');
            this.updateEmptyOldTemplatesFields('Templates');
            this.updateBrandRecipesFields();
            return callback(null, Utils.successResponse({}, Constant.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('updateOldTemplatesFields:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update new fields from old templates fields
     * @param String tableName
     */
    async updateEmptyOldTemplatesFields (tableName) {
        var params = {
            TableName: tableName
        };
        const templateData = await docClient.scan(params).promise();
        templateData.Items.forEach(async (data) => {
            const updateData = await this.getUpdateObject(data);
            const params = {
                TableName: tableName,
                Item: updateData
            };
            await docClient.put(params).promise();
        });
    }

    /**
    * @desc This function is being used to prepare save object
    */
    async getUpdateObject (data) {
        if (!data.homepage_product_section_header || data.homepage_product_section_header === '') {
            data.homepage_product_section_header = data.catalog_brand_sub_heading;
        }
        if (typeof data.homepage_header !== 'undefined' && data.homepage_header) {
            if (typeof data.homepage_header.announcement_bar_text !== 'undefined' && data.homepage_header.announcement_bar_text === '') {
                data.homepage_header.announcement_bar_text = data.banner_text;
            }
        } else {
            data.homepage_header = {
                announcement_bar_text: data.banner_text
            };
        }
        if (typeof data.color_annoucement_bar !== 'undefined' && data.color_annoucement_bar) {
            if (typeof data.color_annoucement_bar.text !== 'undefined' && data.color_annoucement_bar.text === '') {
                data.color_annoucement_bar.text = data.banner_text_color;
            }
        } else {
            data.color_annoucement_bar = {
                text: data.banner_text_color
            };
        }
        if (typeof data.color_text !== 'undefined' && data.color_text) {
            if (typeof data.color_text.heading_links !== 'undefined' && data.color_text.heading_links === '') {
                data.color_text.heading_links = data.header_background_color;
            }
        } else {
            data.color_text = {
                heading_links: data.header_background_color
            };
        }
        if (typeof data.color_background !== 'undefined' && data.color_background) {
            if (typeof data.color_background.header_footer !== 'undefined' && data.color_background.header_footer === '') {
                data.color_background.header_footer = data.footer_background_color;
            }
        } else {
            data.color_background = {
                header_footer: data.footer_background_color
            };
        }
        const emptyItems = [
            'back_to_main_page_color',
            'banner_background_color',
            'banner_text',
            'banner_text_color',
            'brand_awards_sub_heading',
            'catalog_brand_heading',
            'catalog_brand_sub_heading',
            'header_background_color',
            'shopping_cart_icon_color',
            'shopping_cart_icon_hover_color',
            'sign_in_icon_color',
            'sign_in_icon_hover_color',
            'brand_awards_sub_heading_bg_color',
            'buy_now_button_color',
            'buy_now_button_text_color',
            'catalog_brand_background_color',
            'featured_product_background_color',
            'footer_background_color',
            'footer_text_color',
            'link_hover_color',
            'logo_color',
            'product_background_color',
            'product_text_color',
            'terms_and_policy_color',
            'check_availability_popup_text_color',
            'check_availability_popup_subheading_text_color',
            'product_list_button_background_color',
            'product_list_button_text_color',
            'product_list_name_text_color',
            'product_list_price_text_color',
            'product_list_shipping_text_color',
            'product_list_size_text_color',
            'product_detail_button_background_color',
            'product_detail_button_text_color',
            'product_detail_name_text_color',
            'product_detail_type_text_color',
            'product_detail_price_text_color',
            'product_detail_shipping_text_color',
            'product_detail_quantity_text_color',
            'product_detail_size_text_color',
            'template_subheading_text_color',
            'template_type'
        ];
        let itemsData = [];
        itemsData = Object.keys(data).reduce((object, key) => {
            if (!emptyItems.includes(key)) {
                object[key] = data[key];
            }
            return object;
        }, {});
        return itemsData;
    }

    /**
     * Function to update old fields
     */
    async updateBrandRecipesFields () {
        var params = {
            TableName: 'Brand_recipes'
        };
        const recipesData = await docClient.scan(params).promise();
        const emptyItems = [
            'ingredients', 'instructions', 'large_image', 'recipe_name',
            'servings', 'total_time', 'catelog_type', 'alcohol_type'
        ];
        recipesData.Items.forEach(async (data) => {
            let itemsData = [];
            itemsData = Object.keys(data).reduce((object, key) => {
                if (!emptyItems.includes(key)) {
                    object[key] = data[key];
                }
                return object;
            }, {});
            const params = {
                TableName: 'Brand_recipes',
                Item: itemsData
            };
            await docClient.put(params).promise();
        });
    }
}
module.exports.updateOldTemplatesFieldsHandler = async (event, context, callback) =>
    new UpdateOldTemplatesFields().updateOldTemplatesFields(event, context, callback);
