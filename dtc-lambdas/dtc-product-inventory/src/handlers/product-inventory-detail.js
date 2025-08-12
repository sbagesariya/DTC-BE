const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class ProductInventoryDetail {
    /**
    * @desc This function is being used to get product inventory details
    * @since 26/04/2021
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.retailer_id Retailer Id
    * @param {String} req.body.created_at Created At
    */
    async productInventoryDetail (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            const params = {
                TableName: 'Inventory',
                KeyConditionExpression: 'retailer_id = :retailer_id AND createdAt = :createdAt',
                ExpressionAttributeValues: {
                    ':retailer_id': body.retailer_id,
                    ':createdAt': body.created_at
                },
                ProjectionExpression: `retailer_id, product_id, brand_id, retailer_product_id, product_name, brand_name, alcohol_type,
                    size, upc_code, unit_price, stock, sort_brand_name, createdAt`
            };
            try {
                const result = await docClient.query(params).promise();
                const response = result.Items;
                result.Items[0].product_images = {};
                if (response.length) {
                    const productParams = {
                        TableName: 'Products',
                        KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                        ExpressionAttributeValues: {
                            ':brand_id': response[0].brand_id,
                            ':product_id': response[0].product_id
                        },
                        ProjectionExpression: 'ABV, availability_count, description, featured, product_images, price_matrix'
                    };
                    const data = await docClient.query(productParams).promise();
                    const dataResult = data.Items;
                    if (dataResult.length && Object.prototype.hasOwnProperty.call(dataResult[0], 'product_images')
                        && typeof dataResult[0].product_images !== 'undefined') {
                        const productImages = dataResult[0].product_images;
                        Object.keys(productImages).forEach((key) => {
                            var val = productImages[key];
                            productImages[key] = `${process.env.BucketURL}/` + val;
                        });
                        dataResult[0].product_images = productImages;
                    }
                    return Utils.successResponse(Object.assign(result.Items[0], dataResult[0]));
                } else {
                    return Utils.successResponse(result.Items);
                }
            } catch (error) {
                return Utils.errorResponse(Message.SOMETHING_WENT_WRONG, error);
            }
        }).catch((err) => {
            Logger.error('addProductInventory:validateRequest', err);
            return Utils.errorResponse('Failed', err);
        });
    }

    /**
     * @desc This function is being used to validate product inventory detail request
     * @since 27/04/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.retailer_id) {
                reject(Message.RETAILER_REQUIRED);
            } else if (!body.created_at) {
                reject(Message.CREATED_AT);
            } else {
                resolve();
            }
        });
    }
}
module.exports.ProductInventoryDetailHandler = async (event, context, callback) =>
    new ProductInventoryDetail().productInventoryDetail(event, context, callback);
