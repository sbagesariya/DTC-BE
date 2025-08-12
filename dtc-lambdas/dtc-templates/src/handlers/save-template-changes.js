const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const TemplateModel = require('./../../model/templates.model');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');
const dynamodb = require('aws-sdk/clients/dynamodb');
const UUID = require('uuid');
const docClient = new dynamodb.DocumentClient();

const AWS = require('aws-sdk');
const s3 = new AWS.S3();
/**
 * @name SaveTemplateChanges class
 * @author Innovify
 */
class SaveTemplateChanges {
    /**
    * @desc This function is being used to update tempalte changes to Saved_template
    * @author Innovify
    * @since 09/02/2021
    * @param {Object} req Request
    * @param {Object} req.body Request Body
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.template_id Template Id
    * @param {Object} req.body.header Template Headers
    * @param {String} req.body.header.custom_logo Template Headers custom logo
    * @param {Boolean} req.body.header.show_announcement Template Headers anouncement true/false
    * @param {Boolean} req.body.header.homepage_only Template Headers homepage only true/false
    * @param {String} req.body.header.announcement_bar_text Template Headers announcement text
    * @param {String} req.body.featured_product_id Feature product id
    * @param {array} req.body.product_section Product section products array
    * @param {Object} req.body.content_section Content section
    * @param {Boolean} req.body.content_section.show_section Content section images show/hide
    * @param {String} req.body.content_section.heading Content section header text
    * @param {array} req.body.content_section.images Content section images array
    */
    async saveTemplateChanges (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (data) => {
            try {
                body.updatedAt = new Date();
                const updateData = this.getUpdateObject(data, body);
                const params = {
                    TableName: 'Saved_templates',
                    Item: updateData
                };
                await docClient.put(params).promise();
                this.addSavedProducts(body);
                this.updateUpdateAtInTemplate(body);
                this.deleteSavedProducts(body);
                this.deleteS3File(body.delete_logo);
                this.deleteS3File(body.delete_favicon);
                this.removeContentImages(body.delete_content_images);
                this.saveContentSectionForTemplateFive(body.brand_recipe);
                return callback(null, Utils.successResponse());
            } catch (error) {
                Logger.error('saveTemplateChanges:catch', error);
                return callback(null, Utils.errorResponse(error));
            }
        }).catch((err) => {
            Logger.error('saveTemplateChanges:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }


    /**
   * @desc This function is being used to add temp/saved product to saved_products for CMS
   * @since 18/05/2021
   * @param {Object} req.body Request body
   */
    async addSavedProducts (body) {
        try {
            const products = body.product_section.filter(x => (x.isUpdated === true));
            var params = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id
                }
            };
            for (const row of products) {
                params.ExpressionAttributeValues[':product_id'] = row.product_id;
                const product = await docClient.query(params).promise();
                if (product.Items && product.Items.length) {
                    product.Items[0].is_catalog_product = true;
                    product.Items[0].createdAt = new Date().getTime();
                    product.Items[0].updatedAt = new Date().getTime();
                    product.Items[0].template_id = body.template_id;
                    product.Items[0].order_n = row.order_n;
                    const query = {
                        TableName: 'Saved_products',
                        Item: product.Items[0]
                    };
                    await docClient.put(query).promise();
                }
            }
        } catch (error) {
            Logger.error('addSavedProducts:catch', error);
        }
    }

    /**
   * @desc This function is being used to delete other products from Saved_products table that are not in request
   * @since 18/05/2021
   * @param {Object} req.body Request body
   */
    deleteSavedProducts (body) {
        try {
            const params = {
                TableName: 'Saved_products',
                FilterExpression: 'brand_id = :brand_id AND template_id = :template_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id,
                    ':template_id': body.template_id
                }
            };
            if (body.product_section.length) {
                let filter = '';
                let count = 0;
                for (const row of body.product_section) {
                    count++;
                    filter = `${filter} AND product_id <> :product_id${count}`;
                    params.ExpressionAttributeValues[`:product_id${count}`] = row.product_id;
                }
                params.FilterExpression = params.FilterExpression + filter;
            }
            docClient.scan(params, (error, result) => {
                if (error) {
                    Logger.error(error);
                }
                if (result && result.Items.length) {
                    result.Items.forEach((item) => {
                        docClient.delete({ Key: { brand_id: body.brand_id, createdAt: item.createdAt },
                            TableName: 'Saved_products' }, (er) => {
                            if (error) {
                                Logger.error(er);
                            }
                        });
                    });
                }
            });
        } catch (error) {
            Logger.error('deleteSavedProducts:catch', error);
        }
    }

    /**
    * @desc This function is being used to delete file from s3 bucket
    * @author Innovify
    * @since 10/02/2021
    */
    deleteS3File (file) {
        if (file) {
            const params = {
                Bucket: process.env.BucketName,
                Key: file
            };
            s3.deleteObject(params, (err) => {
                if (err) {
                    Logger.error('deleteS3File:', err);
                } else {
                    Logger.info('deleteS3File:', file);
                }
            });
        }
    }
    /**
    * @desc This function is being used to update tempate date
    * @author Innovify
    * @since 09/02/2021
    */
    async updateUpdateAtInTemplate (body) {
        TemplateModel.update({ 'brand_id': body.brand_id, 'template_id': body.template_id },
            { updatedAt: new Date() }, (error, res) => {
                if (error) {
                    Logger.error('updateUpdateAtInTemplate:', error);
                } else {
                    Logger.info('updateUpdateAtInTemplate:', res);
                }
            });
    }
    /**
    * @desc This function is being used to prepare save object
    * @author Innovify
    * @since 09/02/2021
    */
    getUpdateObject (data, body) {
        data.logo = body.logo;
        data.favicon = body.favicon;
        data.logo_alt_text = body.logo_alt_text;
        data.favicon_alt_text = body.favicon_alt_text;
        data.color_text = {
            heading_links: body.color_text.heading_links,
            subheading: body.color_text.subheading,
            body_text: body.color_text.body_text
        };
        data.color_button = {
            background: body.color_button.background,
            text: body.color_button.text,
            border: body.color_button.border,
            hover_color: body.color_button.hover_color
        };
        data.color_background = {
            header_footer: body.color_background.header_footer,
            section: body.color_background.section
        };
        data.color_annoucement_bar = {
            bar: body.color_annoucement_bar.bar,
            text: body.color_annoucement_bar.text
        };
        data.typography_heading = {
            font_family: body.typography_heading.font_family,
            font_style: body.typography_heading.font_style
        };
        data.typography_subheading = {
            font_family: body.typography_subheading.font_family,
            font_style: body.typography_subheading.font_style
        };
        data.typography_body = {
            font_family: body.typography_body.font_family,
            font_style: body.typography_body.font_style
        };
        data.homepage_header = {
            custom_logo: body.header.custom_logo,
            show_announcement: body.header.show_announcement,
            homepage_only: body.header.homepage_only,
            announcement_bar_text: body.header.announcement_bar_text
        };
        data.featured_product_id = body.featured_product_id;
        data.featured_products_description = body.featured_products_description;
        data.homepage_product_section_header = body.product_section_header;
        if (body.content_section) {
            data.homepage_content_section = {
                show_section: body.content_section.show_section,
                heading: body.content_section.heading,
                images: body.content_section.images
            };
        }
        data.updatedAt = new Date().getTime();
        return data;
    }
    /**
      * @desc This function is being used to validate update template request
      * @author Innovify
      * @since 09/02/2021
      * @param {Object} req Request
      * @param {Object} req.body RequestBody
      * @param {String} req.body.brand_id Brand Id
      * @param {String} req.body.template_id Template Id
      */
    async validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.template_id) {
                reject(Message.TEMPLATE_ID_REQUIRED);
            } else if (!body.header || Object.keys(body.header).length === 0 || typeof body.header.show_announcement !== 'boolean' ||
                typeof body.header.homepage_only !== 'boolean') {
                reject(Message.INVALID_HEADER_DETAILS);
            } else if (!body.product_section || !Array.isArray(body.product_section)) {
                reject(Message.INVALID_PRODUCT_SECTION);
            } else {
                this.validateTemplatesRequest(body, resolve, reject);
            }
        });
    }

    /**
      * @desc This function is being used to validate update template request
    */
    async validateTemplatesRequest (body, resolve, reject) {
        var params = {
            TableName: 'Saved_templates',
            KeyConditionExpression: 'brand_id = :brand_id AND template_id = :template_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':template_id': body.template_id
            }
        };
        const template = await docClient.query(params).promise();
        if (template.Count === 0) {
            reject(Message.NO_TEMPLATE_FOUND);
        } else {
            const maxProductLimit = template.Items[0].max_content_product;
            const templateName = template.Items[0].template_name;
            if (body.product_section.length > maxProductLimit) {
                reject(Message.INVALID_PRODUCT_SECTION);
            } else if (templateName === Constant.TEMPLATE_1 && (!body.content_section
                || typeof body.content_section.show_section !== 'boolean' || !Array.isArray(body.content_section.images))) {
                reject(Message.INVALID_CONTENT_SECTION);
            } else {
                resolve(template.Items[0]);
            }
        }
    }

    /**
     * Function to remove content images from S3
     *
     * @param {array} deleteContentImages
     */
    removeContentImages (deleteContentImages) {
        if (Array.isArray(deleteContentImages)) {
            deleteContentImages.forEach(img => {
                this.deleteS3File(img);
            });
        }
    }

    /**
     * Function to store content section for template five
     *
     * @param {Array} brandRecipes
     */
    async saveContentSectionForTemplateFive (brandRecipes) {
        // Removed saved fields and set saved_content_section_type to 0 for this brand
        if (brandRecipes) {
            await this.removeBrandRecipes(brandRecipes.brand_id);
        }
        if (brandRecipes && brandRecipes.saved_content_section_type === 1) {
            // Custom Card information
            this.storeCustomCardInfo(brandRecipes);
        }
        if (brandRecipes && brandRecipes.saved_content_section_type === 2) {
            // Product information
            this.storeProductInfo(brandRecipes);
        }
    }

    /**
     * Function to store custom card content section for template five
     *
     * @param {Array} brandRecipes
     */
    storeCustomCardInfo (brandRecipes) {
        var cardInfo = brandRecipes.card;
        cardInfo.forEach(async (card) => {
            var data = {};
            if (card.recipe_id) {
                data = await this.getRecipesData(brandRecipes.brand_id, card.recipe_id);
            } else {
                data.recipe_id = UUID.v1();
                data.brand_id = brandRecipes.brand_id;
                data.createdAt = new Date().getTime();
            }
            data.saved_content_section_heading = brandRecipes.saved_content_section_heading;
            data.saved_content_section_type = brandRecipes.saved_content_section_type;
            data.saved_card_image = card.img;
            data.saved_card_body = card.body;
            data.updatedAt = new Date().getTime();
            const query = {
                TableName: 'Brand_recipes',
                Item: data
            };
            docClient.put(query).promise();
        });
    }

    /**
     * Function to store product content section for template five
     *
     * @param {Array} brandRecipes
     */
    storeProductInfo (brandRecipes) {
        var productInfo = brandRecipes.product_ids;
        productInfo.forEach(async (product) => {
            var data = {};
            if (product.recipe_id) {
                data = await this.getRecipesData(brandRecipes.brand_id, product.recipe_id);
            } else {
                data.recipe_id = UUID.v1();
                data.brand_id = brandRecipes.brand_id;
                data.createdAt = new Date().getTime();
            }
            data.saved_content_section_heading = brandRecipes.saved_content_section_heading;
            data.saved_content_section_type = brandRecipes.saved_content_section_type;
            data.saved_product_id = product.product_id;
            data.updatedAt = new Date().getTime();
            const query = {
                TableName: 'Brand_recipes',
                Item: data
            };
            docClient.put(query).promise();
        });
    }

    /**
    * @desc This function is being used to remove brand recipes
    * @param {String} brandId brand Id
    */
    async removeBrandRecipes (brandId) {
        var recipes = await this.getBrandsrecipes(brandId);
        recipes.forEach(element => {
            const ProductsParams = {
                TableName: 'Brand_recipes',
                Key: {
                    brand_id: element.brand_id,
                    recipe_id: element.recipe_id
                },
                UpdateExpression: `SET saved_content_section_heading = :update, saved_content_section_type = :section_type,
                        saved_card_image = :update, saved_card_body= :update, saved_product_id = :update`,
                ExpressionAttributeValues: {
                    ':update': '',
                    ':section_type': 0
                }
            };
            docClient.update(ProductsParams).promise();
        });

    }

    /**
     * Function to get brand all recipes
     *
     * @param {String} brandId
     */
    async getBrandsrecipes (brandId) {
        const Params = {
            TableName: 'Brand_recipes',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            }
        };
        var data = await docClient.query(Params).promise();
        return data.Items;
    }

    /**
     * Function to get current all recipes
     *
     * @param {String} brandId
     */
    async getRecipesData (brandId, recipeId) {
        const Params = {
            TableName: 'Brand_recipes',
            KeyConditionExpression: 'brand_id = :brand_id AND recipe_id = :recipe_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':recipe_id': recipeId
            }
        };
        var recipesData = await docClient.query(Params).promise();
        var data = {};
        if (recipesData.Count > 0) {
            data = recipesData.Items[0];
        }
        return data;
    }
}
module.exports.SaveTemplateChangesHandler = async (event, context, callback) =>
    new SaveTemplateChanges().saveTemplateChanges(event, context, callback);
