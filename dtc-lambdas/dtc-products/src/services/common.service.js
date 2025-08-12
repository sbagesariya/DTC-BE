const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const superagent = require('superagent');
const Constants = require('../../utils/constants');
const Logger = require('../../utils/logger');

/**
 * @name CommonService Common service functions
*/
class CommonService {
    /**
    * @desc This function is being used to update total variant count
    * @param {Object} req.body RequestBody
    * @param {String} variantsCount Variants Count
    */
    static async updateTotalVariantCount (body, variantsCount) {
        var params = {
            TableName: 'Products',
            Key: {
                product_id: body.product_id,
                brand_id: body.brand_id
            },
            UpdateExpression: 'SET #variants_count = :variants_count',
            ExpressionAttributeNames: {
                '#variants_count': 'variants_count'
            },
            ExpressionAttributeValues: {
                ':variants_count': parseInt(variantsCount)
            }
        };
        await docClient.update(params).promise();
    }

    /**
    * @desc This Function is being used to get brand details
    * @param {String} BrandId Brand Id
    * @param {String} projection projection
    */
    static async getBrandDetail (brandId, projection) {
        const params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            ProjectionExpression: projection
        };
        const result = await docClient.query(params).promise();
        return result.Items[0];
    }

    /**
     * @desc This function is being used call API to update product inventory
     * @param {body} body Request body
     */
    static updateProductInventory (body) {
        try {
            superagent
                .post(process.env.DTC_UPDATE_FULFILLENT_INVENTORY_URL + Constants.API.UPDATE_PRODUCT_INVENTORY)
                .send(body)
                .set({ 'X-API-Key': process.env.DTC_UPDATE_FULFILLENT_INVENTORY_APIKEY })
                .end((err, result) => {
                    if (err) {
                        Logger.error('updateProductInventory: err', err);
                    } else {
                        Logger.info('updateProductInventory', result);
                    }
                });
        } catch (error) {
            Logger.error('updateProductInventory: catch', error);
        }
    }

    /**
    * @desc This Function is being used to get product details
    * @param {String} BrandId Brand Id
    * @param {String} productId Product Id
    * @param {String} projection projection
    */
    static async getProductDetail (brandId, productId, projection) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': productId,
                ':brand_id': brandId
            },
            ProjectionExpression: projection
        };
        const result = await docClient.query(params).promise();
        return result.Items[0];
    }

    /**
     * Function to create fulfillment center inventory when any new product variant added
     * @param {*} product
     * @param {*} brandDetail
     * @param {*} variant
     */
    static createFulfillmentCenterInventory (product, brandDetail, variant) {
        var params = {
            TableName: Constants.TABLE_FC_INVENTORY,
            Item: {
                fulfillment_center_id: Constants.FC_ID,
                product_id: product.product_id,
                fulfillment_product_id: '',
                brand_id: product.brand_id,
                product_name: product.product_name,
                brand_name: brandDetail.brand_name,
                alcohol_type: product.alcohol_type,
                size: `${variant.variant_size} ${variant.variant_type}`,
                upc_code: variant.upc_code,
                unit_price: 0,
                stock: 0,
                search_stock: '0',
                search_product_name: (product.product_name).toLowerCase(),
                search_brand_name: (brandDetail.brand_name).toLowerCase(),
                sort_brand_name: brandDetail.brand_name,
                search_fulfillment_product_id: '',
                search_alcohol_type: (product.alcohol_type).toLowerCase(),
                search_size: (`${variant.variant_size} ${variant.variant_type}`).toLowerCase(),
                product_images: product.product_images,
                unit_price_per_market: [], // Fulfillment
                shipping: product.shipping,
                sku_code: variant.sku_code,
                search_sku_code: (variant.sku_code || '').toLowerCase(),
                warehouse: '', // Fulfillment
                location_group: '', // Fulfillment
                location: '', // Fulfillment
                createdAt: (new Date()).getTime(),
                updatedAt: (new Date()).getTime()
            }
        };
        docClient.put(params).promise();
    }

    /**
    * @desc This Function is being used to check duplicate variants is exist or not in brand product
    * @param {String} brand_id Brand Id
    * @param {String} product_id Product Id
    * @param {String} sku_code SKU code
    * @param {Number} upc_code UPC code
    * @param {String} variant_size Variant size
    */
    static async checkDuplicateProductVariant (body) {
        const params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id',
            FilterExpression: 'brand_id = :brand_id AND (variant_size = :variant_size OR sku_code = :sku_code OR upc_code = :upc_code)',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':product_id': body.product_id,
                ':sku_code': body.sku_code,
                ':upc_code': body.upc_code,
                ':variant_size': body.variant_size
            },
            Select: 'COUNT'
        };
        const variantData = await docClient.query(params).promise();
        if (variantData.Count) {
            throw Constants.DUPLICATE_PRODUCT_VARIANT;
        }
        return;
    }

    /**
    * @desc This Function is being used to check duplicate variants is exist or not in brand product
    * @param {Array} variants Product size variants
    * @param {String} variants.brand_id Brand Id
    * @param {String} variants.product_id Product Id
    * @param {String} variants.sku_code SKU code
    * @param {Number} variants.upc_code UPC code
    * @param {String} variants.variant_size Variant size
    */
    static isDupicateVariants (variants) {
        for (const key in variants) {
            if (Object.hasOwnProperty.call(variants, key)) {
                const ele = variants[key];
                variants.find((x, index) => {
                    if (index !== Number(key) && (x.variant_size === ele.variant_size || x.upc_code === ele.upc_code || 
                        x.sku_code === ele.sku_code)) {
                        throw Constants.DUPLICATE_PRODUCT_VARIANT;
                    }
                });
            }
        }
        return;
    }

    /**
     * @desc This function is being used to get selected fulfillment preference
     * @since 23/03/2022
     * @param {Object} body Body
     * @param {String} body.brandId Brand id
     */
    static async getFulfillmentPreference (body) {
        var params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brandid || body.brandId
            },
            ProjectionExpression: `fulfillment_options, product_retail_network,
            product_fulfillment_center, market_retail_network, market_fulfillment_center`
        };
        const data = await docClient.query(params).promise();
        const items = data.Items;
        return items[0];
    }
}

module.exports = CommonService;
