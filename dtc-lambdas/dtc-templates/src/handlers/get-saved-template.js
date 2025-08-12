const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetSavedTemplate class
 * @author Innovify
 */
class GetSavedTemplate {
    /**
     * @desc This function is being used to get saved template data
     * @author Innovify
     * @since 05/02/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.template_id Template Id
     */
    async getSavedTemplate (req) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async () => {
            try {
                var params = {
                    TableName: 'Saved_templates',
                    KeyConditionExpression: 'brand_id = :brand_id AND template_id = :template_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id,
                        ':template_id': body.template_id
                    }
                };
                const data = await docClient.query(params).promise();
                if (data.Count > 0 && data.Items[0].featured_product_id) {
                    params = {
                        TableName: 'Products',
                        KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                        ExpressionAttributeValues: {
                            ':brand_id': body.brand_id,
                            ':product_id': String(data.Items[0].featured_product_id)
                        },
                        ProjectionExpression: 'product_name, product_images, description'
                    };
                    const products = await docClient.query(params).promise();
                    if (products && products.Items.length) {
                        data.Items[0].featured_product = products.Items[0].product_name;
                        data.Items[0].featured_product_image =
                            (products.Items[0].product_images && products.Items[0].product_images.img_1) ?
                                `${process.env.BucketURL}/${products.Items[0].product_images.img_1}` : '';
                    }
                }
                return Utils.successResponse(data.Items);
            } catch (error) {
                Logger.error('getSavedTemplate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getSavedTemplate:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate get saved template request
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.template_id Template Id
     */
    validateRequest (body) {
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
}
module.exports.getSavedTemplateHandler = async (event, context, callback) =>
    new GetSavedTemplate().getSavedTemplate(event, context, callback);
