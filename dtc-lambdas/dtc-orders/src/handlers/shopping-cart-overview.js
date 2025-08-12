const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constants = require('../../utils/constants');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const GoogleAnalytics = require('../../utils/ga-config');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const ParameterStore = require('../../utils/ssm');

/**
 * @name ShoppingCartOverview class
 */
class ShoppingCartOverview {
    getOverview (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            const users = await this.prepareGAQuery(body);
            const orders = await this.getOrders(body);
            const abandoned = await this.getAbabdonedCheckout(body);
            this.add(orders.by_status);
            const result = await this.prepareReponse(users, orders, abandoned);
            return Utils.successResponse(result);
        }).catch((err) => {
            Logger.error('validateRequest:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate get shopping cart review api request
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.domain Domain
    * @param {String} req.body.from_date From date
    * @param {String} req.body.to_date To date
    */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.domain) {
                reject(Message.DOMAIN_REQUIRED);
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
     * function to get orders from ES
     * @param {*} req
     */
    async getOrders (req) {
        try {
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                index: 'order-index',
                body: {
                    _source: [
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
                    aggs: {
                        by_status: {
                            'terms': {
                                'field': 'order_status.keyword'
                            }
                        }
                    },
                    size: Constants.ES_DEFAULT_SIZE
                }
            });
            return {
                total_orders: body.hits.total.value,
                by_status: body.aggregations.by_status.buckets

            };
        } catch (error) {
            Logger.error('prepareOrdersData:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async add (arr) {
        const orderStatus = Constants.ORDER_STATUS;
        orderStatus.forEach((value) => {
            const found = arr.some(el => el.key === value);
            if (!found) { arr.push({ key: value, doc_count: 0 }); }
        });
        return arr;
    }

    async prepareReponse (users, result, abandoned) {
        const status = result.by_status;
        var deliverd = status.find(o => o.key === Constants.DELIVERD);
        var shipped = status.find(o => o.key === Constants.SHIPPED);
        var pending = status.find(o => o.key === Constants.PENDING);
        var received = status.find(o => o.key === Constants.RECEIVED);

        var fulfilled = 0;
        var unFulfilled = 0;
        var abd = 0;
        if (users !== 0) {
            fulfilled = (deliverd.doc_count + shipped.doc_count) * 100 / users;
            unFulfilled = (pending.doc_count + received.doc_count) * 100 / users;
            abd = abandoned * 100 / users;
        }

        return {
            'orders': Math.abs(fulfilled).toFixed(2),
            'unfulfilled': Math.abs(unFulfilled).toFixed(2),
            'abandoned': Math.abs(abd).toFixed(2)
        };
    }

    /**
    * @desc This function is being used to get visitors from GA
    * @param {Object} body RequestBody
    */
    async prepareGAQuery (body) {
        const analyticsDataClient = await GoogleAnalytics.connection();
        const propertyId = await ParameterStore.getValue('property_id');
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: this.formatDate(body.from_date),
                    endDate: this.formatDate(body.to_date)
                }
            ],
            dimensions: [
                {
                    name: 'hostName'
                }
            ],
            metrics: [
                {
                    name: Constants.ACTIVE_USERS
                }
            ],
            dimensionFilter: {
                filter: {
                    fieldName: 'hostName',
                    inListFilter: {
                        values: [ body.domain ]
                    }
                }
            }
        });
        let totalUsers = 0;
        if (response.rows.length > 0) {
            totalUsers = (response.rows[0].metricValues.length > 0) ? response.rows[0].metricValues[0].value : 0;
        }
        return totalUsers;
    }

    formatDate (date) {
        var d = new Date(date);
        var month = '' + (d.getMonth() + 1);
        var day = '' + d.getDate();
        var year = d.getFullYear();

        if (month.length < 2) {
            month = '0' + month;
        }

        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    }

    async getAbabdonedCheckout (body) {
        const fromDate = await this.getTimeStamp(body.from_date);
        const toDate = await this.getTimeStamp(body.to_date);
        var params = {
            TableName: 'Cart',
            FilterExpression: 'brand_id = :brand_id AND createdAt BETWEEN :from_date and :to_date',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':from_date': fromDate,
                ':to_date': toDate
            },
            ProjectionExpression: 'user_id'
        };
        const items = await docClient.scan(params).promise();
        const data = items.Items;
        const unique = [...new Set(data.map(item => item.user_id))];
        return unique.length;
    }

    async getTimeStamp (date) {
        var result = new Date(date);
        return result.getTime();
    }
}
module.exports.shoppingCartOverviewHandler = async (event, context, callback) =>
    new ShoppingCartOverview().getOverview(event, context, callback);
