const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const CommonService = require('./../services/common.service');

class DeleteProductVariants {
    /**
     * @desc This function is being used to delete product variants
     * @param {Object} req Request
     * @param {Arrray} req.body Request body
     * @param {String} req.body.product_id Product Ids
     * @param {String} req.body.variant_id Variant Ids
     */
    async deleteProductVariants (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            for (const key in body.variants) {
                if (Object.hasOwnProperty.call(body.variants, key)) {
                    const ele = body.variants[key];
                    var params = {
                        TableName: 'Size_variants',
                        Key: {
                            'product_id': body.product_id,
                            'variant_id': ele.variant_id
                        }
                    };
                    await docClient.delete(params).promise();
                }
            }
            CommonService.getTotalProductCount(body);
            return callback(null, Utils.successResponse([], 'Variant deleted successful'));
        } catch (error) {
            Logger.error('deleteProductVariants:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate delete product variants request
     * @param {Object} req Request
     * @param {Arrray} req.body Request body
     * @param {String} req.body.product_id Product Ids
     * @param {String} req.body.variant_id Variant Ids
     */
    validateRequest (body) {
        if (!body.brand_id || !body.product_id || !Array.isArray(body.variants) || !body.variants.length) {
            throw Message.INVALID_REQUEST;
        } else {
            var isValid = true;
            body.variants.forEach((ele) => {
                if (!ele.variant_id) {
                    isValid = false;
                }
            });
            if (!isValid) {
                throw Message.INVALID_REQUEST;
            } else {
                return;
            }
        }

    }
}

module.exports.DeleteProductVariantsHandler = async (event, context, callback) =>
    new DeleteProductVariants().deleteProductVariants(event, context, callback);
