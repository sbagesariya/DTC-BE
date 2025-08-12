const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetTemplateByDomain class
 *
 */
class GetTemplateByDomain {
    /**
     * @desc This function is being used to get template
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brandid Brand Id
     * @param {String} req.body.template_id Template Id
     */
    async getTemplate (req) {
        const body = req.pathParameters;
        try {
            const domain = await this.validateRequest(body);
            if (domain.brand_id) {
                var params;
                params = {
                    TableName: 'Templates',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': domain.brand_id,
                        ':active': true
                    },
                    FilterExpression: 'active = :active'
                };
                const data = await docClient.query(params).promise();
                if (data.Items && data.Items[0].featured_product_id) {
                    params = {
                        TableName: 'Products',
                        KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                        ExpressionAttributeValues: {
                            ':brand_id': body.brandid,
                            ':product_id': data.Items[0].featured_product_id
                        },
                        ProjectionExpression: 'product_name, product_images, description'
                    };
                    const products = await docClient.query(params).promise();
                    this.assignProductImageUrl(products, data);
                }
                return Utils.successResponse(data.Items);
            }
            return Utils.successResponse({});
        } catch (error) {
            Logger.error('getTemplateByDomain:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate get template request
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.template_id Template Id
     */
    async validateRequest (body) {
        if (!body.domain_name) {
            throw Message.DOMAIN_REQUIRED;
        } else {
            var params = {
                TableName: 'Brand_domains',
                FilterExpression: 'domain_name = :domain_name',
                ExpressionAttributeValues: {
                    ':domain_name': body.domain_name
                },
                ProjectionExpression: 'brand_id'
            };
            const data = await docClient.scan(params).promise();
            if (data.Count > 0) {
                return data.Items[0];
            } else {
                throw Message.NO_DATA_FOUND;
            }
        }
    }

    /**
     * Function to assign full product image url
     *
     * @param {Array} products
     * @param {Array} data
     */
    assignProductImageUrl (products, data) {
        if (products && products.Items.length) {
            data.Items[0].featured_product = products.Items[0].product_name;
            data.Items[0].featured_product_image =
                (products.Items[0].product_images && products.Items[0].product_images.img_1) ?
                    `${process.env.BucketURL}/${products.Items[0].product_images.img_1}` : '';
        }
    }
}
module.exports.getTemplateByDomaindHandler = async (event, context, callback) =>
    new GetTemplateByDomain().getTemplate(event, context, callback);
