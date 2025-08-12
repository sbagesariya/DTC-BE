const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
/**
 * @name PublishTemplate class
 * @author Innovify
 */
class PublishTemplate {
    /**
     * @desc This function is being used to publish tempalte changes to template
     * @author Innovify
     * @since 24/02/2021
     */
    async publishTemplate (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                await this.getUpdateActiveTemplate(body, 'Templates');
                await this.getUpdateActiveTemplate(body, 'Saved_templates');
                await this.getSavedTemplatePublishTemplate(body);
                await this.getSavedProducts(body);
                await this.saveContentSectionForTemplateFive(body);
                return callback(null, Utils.successResponse());
            } catch (error) {
                Logger.error('publishTemplate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('publishTemplate:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to get saved products
    * @since 21/05/2021
    */
    async getSavedProducts (body) {
        var params = {
            TableName: 'Saved_products',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'template_id = :template_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':template_id': body.template_id
            }
        };
        const products = await docClient.query(params).promise();
        if (products && products.Items.length) {
            this.publishSavedProducts(body, products);
        }
        this.updateCatalogsProducts(body, products);
    }

    /**
    * @desc This function is being used to get update active tempate
    * @author Innovify
    * @since 24/02/2021
    */
    async getUpdateActiveTemplate (body, tableName) {
        try {
            var params = {
                TableName: tableName,
                KeyConditionExpression: 'brand_id = :brand_id',
                FilterExpression: 'active = :active',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id,
                    ':active': true
                },
                ProjectionExpression: 'template_id, brand_id'
            };
            let activeTemplate = await docClient.query(params).promise();
            if (activeTemplate.Count > 0) {
                activeTemplate = activeTemplate.Items[0];
                if (activeTemplate.template_id !== body.template_id) {
                    var updateParams = {
                        TableName: tableName,
                        Key: {
                            brand_id: activeTemplate.brand_id,
                            template_id: activeTemplate.template_id
                        },
                        UpdateExpression: 'SET #active = :active',
                        ExpressionAttributeNames: {
                            '#active': 'active'
                        },
                        ExpressionAttributeValues: {
                            ':active': false
                        }
                    };
                    await docClient.update(updateParams).promise();
                }
            }
        } catch (error) {
            Logger.error('getUpdateActiveTemplate:validateRequest', error);
        }
    }

    /**
    * @desc This function is being used to publish saved product
    * @since 21/05/2021
    */
    async publishSavedProducts (body, products) {
        try {
            for (const row of products.Items) {
                var updateParams = {
                    TableName: 'Products',
                    Key: {
                        brand_id: body.brand_id,
                        product_id: row.product_id
                    },
                    UpdateExpression: 'SET #is_catalog_product = :is_catalog_product, #updatedAt = :updatedAt, #order_n = :order_n',
                    ExpressionAttributeNames: {
                        '#is_catalog_product': 'is_catalog_product',
                        '#updatedAt': 'updatedAt',
                        '#order_n': 'order_n'
                    },
                    ExpressionAttributeValues: {
                        ':is_catalog_product': true,
                        ':updatedAt': new Date().getTime(),
                        ':order_n': (row.order_n) ? row.order_n : 0
                    }
                };
                await docClient.update(updateParams).promise();
            }
        } catch (error) {
            Logger.error('publishSavedProducts:validateRequest', error);
        }
    }

    /**
    * @desc This function is being used to update old published products and make it is_catalog_product false
    * @since 21/05/2021
    */
    async updateCatalogsProducts (body, products) {
        try {
            let filter = '';
            let count = 0;
            const params = {
                TableName: 'Products',
                FilterExpression: 'brand_id = :brand_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id
                }
            };
            if (products.Items.length) {
                for (const row of products.Items) {
                    count++;
                    filter = `${filter} AND product_id <> :product_id${count}`;
                    params.ExpressionAttributeValues[`:product_id${count}`] = row.product_id;
                }
                params.FilterExpression = params.FilterExpression + filter;
            } else {
                filter = `${filter} AND is_catalog_product = :is_catalog_product`;
                params.ExpressionAttributeValues[':is_catalog_product'] = true;
                params.FilterExpression = params.FilterExpression + filter;
            }
            docClient.scan(params, (error, result) => {
                if (error) {
                    Logger.error(error);
                }
                if (result && result.Items.length) {
                    result.Items.forEach(async (item) => {
                        var updateParams = {
                            TableName: 'Products',
                            Key: {
                                brand_id: body.brand_id,
                                product_id: item.product_id
                            },
                            UpdateExpression: 'SET #is_catalog_product = :is_catalog_product, #updatedAt = :updatedAt',
                            ExpressionAttributeNames: {
                                '#is_catalog_product': 'is_catalog_product',
                                '#updatedAt': 'updatedAt'
                            },
                            ExpressionAttributeValues: {
                                ':is_catalog_product': false,
                                ':updatedAt': new Date().getTime()
                            }
                        };
                        await docClient.update(updateParams).promise();
                    });
                }
            });
        } catch (error) {
            Logger.error('updateCatalogsProducts:validateRequest', error);
        }
    }

    /**
    * @desc This function is being used to get saved update Template & Publish tempate
    * @author Innovify
    * @since 24/02/2021
    */
    async getSavedTemplatePublishTemplate (body) {
        var params = {
            TableName: 'Saved_templates',
            Key: {
                brand_id: body.brand_id,
                template_id: body.template_id
            },
            UpdateExpression: 'SET #active = :active',
            ExpressionAttributeNames: {
                '#active': 'active'
            },
            ExpressionAttributeValues: {
                ':active': true
            }
        };
        await docClient.update(params).promise();
        params = {
            TableName: 'Saved_templates',
            KeyConditionExpression: 'brand_id = :brand_id AND template_id = :template_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':template_id': body.template_id
            }
        };
        let data = await docClient.query(params).promise();
        data = data.Items[0];
        const currentDate = new Date();
        data.updatedAt = currentDate.getTime();
        params = {
            TableName: 'Templates',
            Item: data
        };
        await docClient.put(params).promise();
        if (data.featured_product_id) {
            this.updateFeaturedProduct(body, data.featured_product_id);
        }
    }

    /**
      * @desc This function is being used to validate update template request
      * @author Innovify
      * @since 24/02/2021
      * @param {Object} req Request
      * @param {Object} req.body RequestBody
      * @param {String} req.body.brand_id Brand Id
      * @param {String} req.body.template_id Template Id
      */
    async validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.template_id) {
                reject(Message.TEMPLATE_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to get update active tempate
    * @param {Object} req.body RequestBody
    * @param {String} featuredProductId Featured Product Id
    */
    async updateFeaturedProduct (body, featuredProductId) {
        try {
            const queryParams = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id,
                    ':product_id': String(featuredProductId)
                },
                Select: 'COUNT'
            };
            const existProductCount = await docClient.query(queryParams).promise();
            if (existProductCount.Count > 0) {
                this.updateExistingFeaturedProduct(body);
                const ProductParams = {
                    TableName: 'Products',
                    Key: {
                        brand_id: body.brand_id,
                        product_id: featuredProductId
                    },
                    UpdateExpression: 'SET featured = :featured',
                    ExpressionAttributeValues: {
                        ':featured': 'true'
                    }
                };
                await docClient.update(ProductParams).promise();
            }
        } catch (error) {
            Logger.error('updateFeaturedProduct:validateRequest', error);
        }
    }

    /**
    * @desc This function is being used to get update active tempate
    * @param {Object} req.body RequestBody
    */
    async updateExistingFeaturedProduct (body) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'featured = :featured',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':featured': 'true'
            },
            ProjectionExpression: 'product_id, brand_id'
        };
        let featuredProduct = await docClient.query(params).promise();
        if (featuredProduct.Count > 0) {
            featuredProduct = featuredProduct.Items[0];
            const ProductsParams = {
                TableName: 'Products',
                Key: {
                    brand_id: body.brand_id,
                    product_id: featuredProduct.product_id
                },
                UpdateExpression: 'SET featured = :featured',
                ExpressionAttributeValues: {
                    ':featured': 'false'
                }
            };
            await docClient.update(ProductsParams).promise();
        }
    }

    /**
    * @desc This function is being used to save content section for template five
    * @param {Object} req.body RequestBody
    */
    async saveContentSectionForTemplateFive (body) {
        if (this.checkTemplateType(body)) {
            await this.removeBrandRecipes(body.brand_id);
            const params = {
                TableName: 'Brand_recipes',
                KeyConditionExpression: 'brand_id = :brand_id',
                ExpressionAttributeValues: {
                    ':brand_id': body.brand_id
                }
            };
            const result = await docClient.query(params).promise();
            if (result.Count) {
                result.Items.forEach(data => {
                    data.content_section_heading = data.saved_content_section_heading;
                    data.content_section_type = data.saved_content_section_type;
                    if (data.saved_content_section_type === 1) {
                        data.card_image = data.saved_card_image;
                        data.card_body = data.saved_card_body;
                    } else {
                        data.product_id = data.saved_product_id;
                    }
                    const query = {
                        TableName: 'Brand_recipes',
                        Item: data
                    };
                    docClient.put(query).promise();
                });
            }
        }
    }

    /**
    * @desc This function is being used to check template type
    * @param {Object} req.body RequestBody
    */
    async checkTemplateType (body) {
        const params = {
            TableName: 'Templates',
            KeyConditionExpression: 'brand_id = :brand_id AND template_id = :template_id',
            FilterExpression: 'active = :active AND template_name = :template_name',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':template_id': body.template_id,
                ':active': true,
                ':template_name': Constant.TEMPLATE_5
            },
            Select: 'COUNT'
        };
        const result = await docClient.query(params).promise();
        return result.Count;
    }

    /**
    * @desc This function is being used to remove brand recipes
    * @param {String} brandId brand Id
    */
    async removeBrandRecipes (brandId) {
        const params = {
            TableName: 'Brand_recipes',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'saved_content_section_type = :section_type',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':section_type': 0
            },
            ProjectionExpression: 'recipe_id'
        };
        const result = await docClient.query(params).promise();
        if (result.Count) {
            const recipeIds = result.Items.map(obj => obj.recipe_id);
            var recipesParams = {
                TableName: 'Brand_recipes'
            };
            recipeIds.forEach(async (recipeId) => {
                recipesParams.Key = { brand_id: brandId, recipe_id: recipeId };
                await docClient.delete(recipesParams).promise();
            });
        }
    }

}
module.exports.PublishTemplateHandler = async (event, context, callback) => new PublishTemplate().publishTemplate(event, context, callback);
