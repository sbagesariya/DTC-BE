// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');

/**
 * @name GetRecipeDetails class
 *
 */
class GetRecipeDetails {

    /**
     * Function to get brand recipe for template five
     *
     * @param {params} event
     * @param {*} context
     * @param {*} callback
    */
    async getDetail (event) {
        const id = event.pathParameters.brandid;
        const published = event.pathParameters.published;
        var params = {
            TableName: 'Brand_recipes',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': id,
                ':section_type': 0
            }
        };
        if (published === 'true') {
            params.ProjectionExpression = `brand_id, recipe_id, content_section_heading,
            content_section_type, card_image, card_body, product_id`;
            params.FilterExpression = 'content_section_type > :section_type';
        } else {
            params.ProjectionExpression = `brand_id, recipe_id, saved_content_section_heading, saved_content_section_type,
            saved_card_image, saved_card_body, saved_product_id`;
            params.FilterExpression = 'saved_content_section_type > :section_type';
        }
        const data = await docClient.query(params).promise();
        const items = data.Items;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            let productinfo;
            items[i].product_detail = [];
            if (item.content_section_type === 2 && published === 'true') {
                productinfo = await this.getProductInfo(item.product_id, item.brand_id);
                items[i].product_detail.push(productinfo);
            }
            if (item.saved_content_section_type === 2 && published === 'false') {
                productinfo = await this.getProductInfo(item.saved_product_id, item.brand_id);
                items[i].product_detail.push(productinfo);
            }
        }
        return Utils.successResponse(items);
    }

    /**
     * Function to get product detail
     *
     * @param {String} productId
     * @param {String} brandId
     */
    async getProductInfo (productId, brandId) {
        var item = [];
        if (productId) {
            var params = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
                ExpressionAttributeValues: {
                    ':brand_id': brandId,
                    ':product_id': productId
                },
                ProjectionExpression: 'product_name, product_images, description, product_id'
            };
            const products = await docClient.query(params).promise();
            item = products.Items[0];
            if (Object.prototype.hasOwnProperty.call(item, 'product_images') && typeof item.product_images !== 'undefined') {
                const productImages = item.product_images;
                Object.keys(productImages).forEach((key) => {
                    var val = productImages[key];
                    productImages[key] = `${process.env.BucketURL}/` + val;
                });
            }
        }
        return item;
    }
}
module.exports.getRecipesByBrandIdHandler = async (event, context, callback) =>
    new GetRecipeDetails().getDetail(event, context, callback);
