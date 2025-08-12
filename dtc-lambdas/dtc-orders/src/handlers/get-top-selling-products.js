const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const Constants = require('../../utils/constants');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const ParameterStore = require('../../utils/ssm');

class GetTopSellingProducts {

    /**
    * @desc This unction is being used to to get dashboard top selling products
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.from_date From Date
    * @param {String} req.body.to_date To Date
    */
    async getTopSellingProducts (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const result = await this.prepareOrdersData(body);
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('getTopSellingProducts:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getTopSellingProducts:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate request
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.from_date From Date
    * @param {String} req.body.to_date To Date
    */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.from_date) {
                reject(Message.FROM_DATE_REQUIRED);
            } else if (!body.to_date) {
                reject(Message.TO_DATE_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being used to prepare orders from ES
    * @param {String} req Request Body
    */
    async prepareOrdersData (req) {
        try {
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                index: 'order-index',
                body: {
                    _source: [
                        'order_id',
                        'product_detail',
                        'search_placed_on'
                    ],
                    query: {
                        bool: {
                            must: [
                                { 'match': { 'brand_id.keyword': req.brand_id } }
                            ],
                            filter: [
                                {
                                    range: {
                                        'search_placed_on.keyword': {
                                            'gte': req.from_date || null,
                                            'lte': req.to_date || null,
                                            'format': 'MM/dd/yyyy'
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    size: Constants.ES_DEFAULT_SIZE,
                    collapse: {
                        field: 'product_detail.product_id.keyword',
                        inner_hits: {
                            name: 'product_list',
                            size: Constants.ES_DEFAULT_SIZE
                        }
                    }
                }
            });
            const totalRecords = body.hits.total.value;
            let result = [];
            if (totalRecords > 0) {
                result = await this.prepareData(body.hits.hits, req.brand_id);
            }
            return result;
        } catch (error) {
            Logger.error('prepareOrdersData:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to prepare ES Data
    * @param {String} esData ES Data
    * @param {String} brandId Brand Id
    */
    async prepareData (esData, brandId) {
        const products = [];
        const temp = [];
        esData.map(orders => {
            orders.inner_hits.product_list.hits.hits.map(product => {
                const orderId = product._source.sort_order_id;
                if (temp.indexOf(orderId) === -1) {
                    temp.push(orderId);
                    product._source.product_detail.forEach(element => {
                        const productId = element.product_id;
                        const index = products.findIndex(p => p.product_id === productId);
                        if (index === -1) {
                            products.push({
                                product_id: productId,
                                product: element.name,
                                orders: 1,
                                total: (element.price * element.qty)
                            });
                        } else {
                            products[index].orders += 1;
                            products[index].total += (element.price * element.qty);
                        }
                    });
                }
            });
        });
        products.sort((a, b) => (a.orders > b.orders ? -1 : 1));
        const productData = products.slice(0, 3);
        for (const i in productData) {
            if (Object.hasOwnProperty.call(productData, i)) {
                const product = productData[i];
                productData[i].product_images = await this.getProductImage(brandId, product.product_id);
            }
        }
        return productData;
    }

    /**
    * @desc This function is being used to get product images
    * @param {String} brandId Brand Id
    * @param {String} productId Product Id
    */
    async getProductImage (brandId, productId) {
        const params = {
            TableName: 'Products',
            KeyConditionExpression: 'brand_id = :brand_id AND product_id = :product_id',
            ExpressionAttributeValues: {
                ':product_id': productId,
                ':brand_id': brandId
            },
            ProjectionExpression: 'product_images'
        };
        const BucketURL = await ParameterStore.getValue('buket_url');
        const data = await docClient.query(params).promise();
        const item = data.Items;
        var productImages = null;
        if (item.length && Object.prototype.hasOwnProperty.call(item[0], 'product_images') && item[0].product_images) {
            productImages = item[0].product_images;
            Object.keys(productImages).forEach(async (key) => {
                var val = productImages[key];
                productImages[key] = `${BucketURL}/` + val;
            });
        }
        return productImages;
    }
}

module.exports.getTopSellingProductsHandler = async (event, context, callback) =>
    new GetTopSellingProducts().getTopSellingProducts(event, context, callback);
