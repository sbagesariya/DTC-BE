const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetTemplate class
 * @author Innovify
 */
class GetTemplate {
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
        return this.validateRequest(body).then(async () => {
            try {
                var params;
                if (!body.template_id) {
                    params = {
                        TableName: 'Templates',
                        KeyConditionExpression: 'brand_id = :brand_id',
                        ExpressionAttributeValues: {
                            ':brand_id': body.brandid,
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
                } else {
                    params = {
                        TableName: 'Templates',
                        KeyConditionExpression: 'brand_id = :brand_id AND template_id = :template_id',
                        ExpressionAttributeValues: {
                            ':brand_id': body.brandid,
                            ':template_id': body.template_id
                        }
                    };
                    const data = await docClient.query(params).promise();
                    return Utils.successResponse(data.Items);
                }
            } catch (error) {
                Logger.error('getTemplate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getTemplate:validateRequest', err);
            return Utils.errorResponse(err);
        });
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
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brandid) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                resolve();
            }
        });
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
module.exports.getTemplateByBrandIdHandler = async (event, context, callback) =>
    new GetTemplate().getTemplate(event, context, callback);
