const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Logger = require('./../../utils/logger');
const Constants = require('../../utils/constants');
const Message = require('../../utils/message');
const ElasticSearch = require('../../utils/es-config');
const ParameterStore = require('../../utils/ssm');
const CommonService = require('./../services/common.service');
class GetProductsByBrandId {

    /**
    * @desc This function is being used to to get product
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brandid Brand Id
    * @param {String} req.body.sort_by sort by
    * @param {Array} req.body.size size
    * @param {Array} req.body.type type
    * @param {String} req.body.limit limit
    */
    async getProductsByBrandId (req, context, callback) {
        const body = JSON.parse(req.body);
        const limit = body.limit || 6;
        const tableName = (body.iscms) ? 'Saved_products' : 'Products';
        // Get products for catalogs
        return this.getRetailerFulfillmentProducts(body, callback).then(()=> {
            // Get products for CMS templates
            return this.getProductsByVariantFilter(body).then(async (sizeVariantList)=> {
                var params = {
                    TableName: tableName,
                    ExpressionAttributeValues: {
                        ':brand_id': body.brandid,
                        ':product_status': 0,
                        ':is_catalog_product': true
                    },
                    Limit: limit
                };
                if (body.iscms) {
                    params.ExpressionAttributeValues[':template_id'] = body.template_id;
                    params.FilterExpression = `product_status > :product_status and is_catalog_product = :is_catalog_product
                    AND template_id = :template_id`;
                } else {
                    params.FilterExpression = 'product_status > :product_status and is_catalog_product = :is_catalog_product';
                }

                this.prepareQuery(body, params, sizeVariantList);
                const Limit = limit;
                if (body.lastKey) {
                    params.ExclusiveStartKey = body.lastKey;
                }
                const scanResults = [];
                let productData;
                const BucketURL = await ParameterStore.getValue('buket_url');
                do {
                    if (sizeVariantList) {
                        productData = await docClient.scan(params).promise();
                    } else {
                        productData = await docClient.query(params).promise();
                    }
                    const items = productData.Items;
                    await this.prepareResult(items, scanResults, BucketURL);
                    params.ExclusiveStartKey = productData.LastEvaluatedKey;
                    params.Limit = Limit - scanResults.length;
                } while (scanResults.length < Limit && productData.LastEvaluatedKey);
                return Utils.successResponse({ data: scanResults, lastKey: productData.LastEvaluatedKey || '' });
            }).catch((err) => {
                Logger.error('getProductsByBrandId:getProductsByVariantFilter', err);
                return Utils.errorResponse(err);
            });
        }).catch((err) => {
            Logger.error('getProductsByBrandId:getRetailerProducts', err);
            return Utils.errorResponse(err);
        });
    }

    prepareQuery (body, params, sizeVariantList) {
        if (sizeVariantList) {
            params.FilterExpression = params.FilterExpression + ' and brand_id = :brand_id and (';
            let index = 0;
            sizeVariantList.forEach((value) => {
                index++;
                params.FilterExpression = `${params.FilterExpression}product_id = :product_id${index} or `;
                params.ExpressionAttributeValues[':product_id' + index] = value.product_id;
            });
            params.FilterExpression = params.FilterExpression.substring(0, params.FilterExpression.length - 4);
            params.FilterExpression = params.FilterExpression + ')';
        } else {
            params.KeyConditionExpression = 'brand_id = :brand_id';
        }
        if (body.type && body.type !== '') {
            params.FilterExpression += ` and alcohol_type IN (${body.type.map((id, i) => `:alcoholType${i}`).join(', ')})`;
            params.ExpressionAttributeValues = Object.assign(params.ExpressionAttributeValues, body.type.reduce((obj, id, i) => {
                obj[`:alcoholType${i}`] = id;
                return obj;
            }, {}));
        }
        if (body.sort_by && body.sort_by !== '') {
            if (body.sort_by === 1) {
                params.ScanIndexForward = false;
                params.IndexName = 'brand_id-featured-index';
            } else if (body.sort_by === 4) {
                params.ScanIndexForward = true;
                params.IndexName = 'brand_id-order_n-index';
            } else {
                params.IndexName = 'brand_id-price-index';
                params.ScanIndexForward = body.sort_by !== 3;
            }
        }
    }

    /**
    * @desc This function is being used to get product variant by variant size
    * @param {object} body request object
    */
    async getProductsByVariantFilter (body) {
        return new Promise((resolve, reject) => {
            if (body.size && Array.isArray(body.size)) {
                const query = {
                    TableName: 'Size_variants',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brandid
                    },
                    FilterExpression: '',
                    IndexName: 'brand_id-index'
                };
                var index = 0;
                body.size.forEach((value) => {
                    index++;
                    query.FilterExpression = `${query.FilterExpression}variant_size = :variant_size${index} or `;
                    query.ExpressionAttributeValues[':variant_size' + index] = Number(value.substring(0, value.length - 3));
                });
                query.FilterExpression = query.FilterExpression.substring(0, query.FilterExpression.length - 4);
                docClient.query(query, (err, data)=> {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data.Items);
                    }
                });
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to check if retailer ID is available
    * @param {String} body.retailer_id retailerId
    * @param {String} body.fulfillment_centers fulfillmentCenterId
    * @param {String} body.brandid brand Id
    * @param {callback} callback callback
    */
    getRetailerFulfillmentProducts (body, callback) {
        return new Promise((resolve) => {
            if ((Array.isArray(body.retailers) && body.retailers.length ||
                Array.isArray(body.fulfillment_centers) && body.fulfillment_centers.length) && !body.iscms) {
                this.getBrandsProduct(body).then((products) => {
                    if (products.length) {
                        const productIds = products.map((el)=> { return el.product_id; });
                        this.getAvailableProduct(body, productIds, callback);
                    } else {
                        callback(null, Utils.errorResponse(Message.PRODUCT.NO_DATA_FOUND));
                    }
                }).catch((err) => {
                    Logger.error('getProductsByBrandId:getBrandsProduct', err);
                    return Utils.errorResponse(err);
                });
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to get brands product
    * @param {String} req.retailer_id retailerId
    * @param {String} req.brandid brand Id
    */
    getBrandsProduct (body) {
        return new Promise((resolve, reject) => {
            var params = {
                TableName: 'Products',
                KeyConditionExpression: 'brand_id = :brand_id',
                FilterExpression: 'is_catalog_product = :is_catalog_product',
                ExpressionAttributeValues: {
                    ':brand_id': body.brandid,
                    ':is_catalog_product': true
                }
            };
            if (body.sort_by === 1) {
                params.ScanIndexForward = false;
                params.IndexName = 'brand_id-featured-index';
            }
            docClient.query(params, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.Items);
                }
            });
        });
    }

    /**
    * @desc This function is being used to get retailer/fulfillment product
    * @param {String} req.retailer_id retailerId
    * @param {String} req.fulfillment_centers fulfillmentCenterId
    * @param {String} req.brandid brand Id
    * @param {Array} productIds productIds
    * @param {callback} callback callback
    */
    async getAvailableProduct (req, productIds, callback) {
        try {
            const client = await ElasticSearch.connection();
            const fulfillmentPreference = await CommonService.getFulfillmentPreference(req);
            const { body } = await client.search(this.prepareESQuery(req, productIds, fulfillmentPreference));
            const inventory = [];
            let variants = [];
            const BucketURL = await ParameterStore.getValue('buket_url');
            const totalRecords = body.hits.total.value;
            if (totalRecords > 0) {
                body.hits.hits.forEach(products => {
                    variants = [];
                    products.inner_hits.most_recent.hits.hits.forEach(variant => {
                        if ((variants.findIndex(obj => obj.size === variant._source.size)) === -1) {
                            let price = [];
                            if (variant._source.unit_price_per_market) {
                                price = variant._source.unit_price_per_market.filter(x =>
                                    x.states.find(y => y.name === req.state ));
                            }
                            variants.push({
                                size: variant._source.size,
                                price: price.length ? price[0].rate : variant._source.unit_price,
                                retailer_id: variant._source.retailer_id,
                                fulfillment_center_id: variant._source.fulfillment_center_id,
                                stock: variant._source.stock,
                                sku_code: variant._source.sku_code || null
                            });
                        }
                    });
                    const prepareProducts = products.inner_hits.most_recent.hits.hits[0]._source;
                    prepareProducts.matrix = variants.sort((a, b) => a.price - b.price);
                    if (Object.prototype.hasOwnProperty.call(prepareProducts, 'product_images') && prepareProducts.product_images) {
                        const productImages = prepareProducts.product_images;
                        Object.keys(productImages).forEach(async (key) => {
                            var val = productImages[key];
                            productImages[key] = `${BucketURL}/` + val;
                        });
                    }
                    inventory.push(prepareProducts);
                });
                if (!inventory.length) {
                    return callback(null, Utils.errorResponse(Message.PRODUCT.NO_DATA_FOUND));
                } else {
                    return callback(null, Utils.successResponse({ 'data': inventory, 'total_records': totalRecords }));
                }
            } else {
                return callback(null, Utils.errorResponse(Message.PRODUCT.NO_DATA_FOUND));
            }
        } catch (error) {
            Logger.error('getAvailableProduct:catch', error);
            return callback(null, Utils.errorResponse(error));
        }
    }

    /**
    * @desc This function is being used to prepare get inventory list from ES query
    * @param {String} req.retailer_id retailerId
    * @param {String} req.fulfillment_centers fulfillmentCenterId
    * @param {String} req.brandid brand Id
    * @param {Array} productIds productIds
    * @param {Array} fulfillmentPreference Fulfillment Preference
    */
    prepareESQuery (req, productIds, fulfillmentPreference) {
        const limit = (!req.limit || req.limit === 'ALL') ? 10000 : req.limit;
        const offset = req.page ? req.page * limit : 0;
        var mainQuery = [];
        var queryParams = [
            { match: { 'brand_id.keyword': req.brandid } },
            { range: { 'stock': { gt: 0 } } },
            { terms: { 'product_id.keyword': productIds } }
        ];
        var fulfillmentQueryParams = JSON.parse(JSON.stringify(queryParams));
        let retailerProductType = [];
        let fulfillmentProductType = [];
        const type = req.type || [];
        if (fulfillmentPreference.fulfillment_options === Constants.FULFILLMENT_OPTION.PRODUCT) {
            retailerProductType = fulfillmentPreference.product_retail_network;
            const retilerTypes = retailerProductType.filter(r=> type.includes(r));
            fulfillmentProductType = fulfillmentPreference.product_fulfillment_center;
            const fulfillmentTypes = fulfillmentProductType.filter(r=> type.includes(r));
            if (type.length) {
                queryParams.push({ terms: { 'alcohol_type.keyword':
                    retilerTypes.length ? retilerTypes : [] } });
                fulfillmentQueryParams.push({ terms: { 'alcohol_type.keyword':
                        fulfillmentTypes.length ? fulfillmentTypes : [] } });
            } else {
                queryParams.push({ terms: { 'alcohol_type.keyword': retailerProductType } });
                fulfillmentQueryParams.push({ terms: { 'alcohol_type.keyword': fulfillmentProductType } });
            }
        } else if (type.length) {
            queryParams.push({ terms: { 'alcohol_type.keyword': type } });
            fulfillmentQueryParams.push({ terms: { 'alcohol_type.keyword': type } });
        }
        if (req.size) {
            queryParams.push({ terms: { 'search_size.keyword': req.size } });
            fulfillmentQueryParams.push({ terms: { 'search_size.keyword': req.size } });
        }
        if (Array.isArray(req.retailers) && req.retailers.length) {
            queryParams.unshift({ terms: { 'retailer_id.keyword': req.retailers } });
            mainQuery.push({
                bool:
                {
                    must: queryParams,
                    filter: {
                        term: {
                            _index: 'inventory-index'
                        }
                    }
                }
            });
        }
        if (Array.isArray(req.fulfillment_centers) && req.fulfillment_centers.length) {
            fulfillmentQueryParams.push({ terms: { 'fulfillment_center_id.keyword': req.fulfillment_centers } });
            fulfillmentQueryParams.push({ match: { 'unit_price_per_market.states.name': req.state } });
            mainQuery.push({
                bool:
                {
                    must: fulfillmentQueryParams,
                    filter: {
                        term: {
                            _index: 'fulfillment-inv-index'
                        }
                    }
                }
            });
        }
        let sort;
        if (req.sort_by === 2) {
            sort = [{ 'unit_price': 'asc' }];
        } else if (req.sort_by === 3) {
            sort = [{ 'unit_price': 'desc' }];
        } else {
            sort = [{ 'product_id.keyword': { 'order': 'asc' } }];
        }
        return {
            body: {
                _source: Constants.ES.PRODUCT_FIELDS,
                query: {
                    bool: {
                        should: mainQuery
                    }
                },
                collapse: {
                    field: 'product_id.keyword',
                    inner_hits: {
                        name: 'most_recent',
                        size: '100'
                    }
                },
                from: offset,
                size: limit,
                sort: sort
            }
        };
    }

    /**
    * @desc This function is being used to get prepare result
    * @param {Object} items Items
    * @param {Array} scanResults Scan Results
    * @param {String} BucketURL Bucket URL
    */
    prepareResult (items, scanResults, BucketURL) {
        for (const i in items) {
            if (Object.hasOwnProperty.call(items, i)) {
                const item = items[i];
                if (Object.prototype.hasOwnProperty.call(item, 'product_images') && typeof item.product_images != 'undefined') {
                    const productImages = item.product_images;
                    Object.keys(productImages).forEach(async (key) => {
                        var val = productImages[key];
                        productImages[key] = `${BucketURL}/` + val;
                    });
                }
                scanResults.push(item);
            }
        }
        return scanResults;
    }
}
module.exports.getProductsByBrandIdHandler = async (event, context, callback) =>
    new GetProductsByBrandId().getProductsByBrandId(event, context, callback);
