
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const UUID = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const CommonService = require('./../services/common.service');
const Constants = require('../../utils/constants');

/**
 * @name AddVariant class
 */
class AddVariant {

    /**
     * @desc This function is being used to add variant data
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.product_id Product Id
     * @param {String} req.body.variant_size Variant Size
     * @param {String} req.body.variant_type Variant Type
     * @param {String} req.body.upc_code upc_code
     * @param {String} req.body.sku_code SKU Code
     */
    async addVariant (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            await this.validateRequest(body);
            var params = {
                TableName: 'Size_variants',
                Item: {
                    variant_id: UUID.v4(),
                    product_id: body.product_id,
                    variant_size: body.variant_size,
                    variant_type: body.variant_type,
                    upc_code: body.upc_code,
                    brand_id: body.brand_id,
                    product_name: body.product_name,
                    alcohol_type: body.alcohol_type,
                    sku_code: body.sku_code,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                }
            };
            await docClient.put(params).promise();
            const variantsCount = await this.getTotalVariantCount(body.product_id);
            CommonService.updateTotalVariantCount(body, variantsCount);
            this.createProductInventory(body);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('addVariant:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to validate add variant request
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.product_id Product Id
     * @param {String} req.body.variant_size Variant Size
     * @param {String} req.body.variant_type Variant Type
     * @param {String} req.body.upc_code upc_code
     * @param {String} req.body.sku_code SKU code
     */
    async validateRequest (body) {
        if (!body.brand_id) {
            throw Message.PRODUCT.BRAND_ID_REQUIRED;
        } else if (!body.product_id) {
            throw Message.PRODUCT.PRODUCT_ID_REQUIRED;
        } else if (!body.variant_size) {
            throw Message.PRODUCT.SIZE_REQUIRED;
        } else if (!body.variant_type) {
            throw Message.PRODUCT.VARIANT_TYPE_REQUIRED;
        } else if (!body.upc_code) {
            throw Message.PRODUCT.UPC_REQUIRED;
        } else if (!body.sku_code) {
            throw Message.PRODUCT.SKU_REQUIRED;
        } else {
            await CommonService.checkDuplicateProductVariant(body);
            await this.getProduct(body);
        }
    }

    /**
     * @desc This function is being used to get product details
     * @param {Object} body RequestBody
     * @param {String} body.brand_id Brand Id
     * @param {String} body.product_id Product Id
     */
    async getProduct (body) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':product_id': body.product_id
            }
        };
        const productData = await docClient.query(params).promise();
        if (productData.Count > 0) {
            body.product_name = productData.Items[0].product_name;
            body.alcohol_type = productData.Items[0].alcohol_type;
            return;
        } else {
            throw Message.PRODUCT.NO_DATA_FOUND;
        }
    }

    /**
    * @desc This function is being used to get total variant count
    * @param {String} productId Product Id
    */
    async getTotalVariantCount (productId) {
        const params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': productId
            },
            Select: 'COUNT'
        };
        const variantData = await docClient.query(params).promise();
        return variantData.Count;
    }

    /**
     * Function to start process create product inventory
     * @param {*} body
     */
    async createProductInventory (body) {
        const projection = 'brand_name, fulfillment_options, product_fulfillment_center';
        const brandDetail = await CommonService.getBrandDetail(body.brand_id, projection);
        if ((brandDetail.fulfillment_options === Constants.FULFILLMENT_OPTION.PRODUCT &&
            brandDetail.product_fulfillment_center.indexOf(body.alcohol_type) != -1) ||
            brandDetail.fulfillment_options === Constants.FULFILLMENT_OPTION.MARKET) {
            const productProjection = 'product_id, brand_id, product_name, alcohol_type, product_images, shipping';
            const productDetail = await CommonService.getProductDetail(body.brand_id, body.product_id, productProjection);
            CommonService.createFulfillmentCenterInventory(productDetail, brandDetail, body);
            CommonService.updateProductInventory({ brand_id: body.brand_id });
        }
    }
}
module.exports.addVariantHandler = async (event, context, callback) => new AddVariant().addVariant(event, context, callback);
