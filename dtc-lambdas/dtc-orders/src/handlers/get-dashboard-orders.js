const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const Constants = require('../../utils/constants');
const moment = require('moment');

class GetDashboardOrders {

    /**
    * @desc This function is being used to to get dashboard orders
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.from_date From Date
    * @param {String} req.body.to_date To Date
    */
    async getDashboardOrders (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const result = await this.prepareOrdersData(body);
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('getDashboarOrders:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getDashboarOrders:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate get dashboard orders request
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
                        totalSales: { 'sum': { 'field': 'sort_total' } }
                    },
                    collapse: {
                        field: 'search_placed_on.keyword',
                        inner_hits: {
                            name: 'most_recent',
                            size: Constants.ES_DEFAULT_SIZE
                        }
                    },
                    sort: [
                        { 'search_placed_on.keyword': { 'order': 'asc' } }
                    ],
                    size: Constants.ES_DEFAULT_SIZE
                }
            });
            let ordersData = [];
            let salesData = [];
            const totalRecords = body.hits.total.value;
            if (totalRecords > 0) {
                const fromDate = this.dateFormat(new Date(req.from_date));
                const toDate = this.dateFormat(new Date(req.to_date));
                const dateRanges = this.getDatesDiff(fromDate, toDate);
                ordersData = JSON.parse(JSON.stringify(dateRanges));
                salesData = JSON.parse(JSON.stringify(dateRanges));
                body.hits.hits.map(orders => {
                    const orderIndex = ordersData.findIndex(o => o.date === orders._source.search_placed_on);
                    ordersData[orderIndex].total = orders.inner_hits.most_recent.hits.total.value;
                    let totSales = 0;
                    orders.inner_hits.most_recent.hits.hits.map(order => {
                        totSales += order._source.sort_total;
                    });
                    const salesIndex = salesData.findIndex(s => s.date === orders._source.search_placed_on);
                    salesData[salesIndex].total = totSales;
                });
            }
            this.calculateVariance(ordersData);
            this.calculateVariance(salesData);
            return {
                totalSales: body.aggregations.totalSales.value,
                totalOrders: totalRecords,
                ordersData,
                salesData
            };
        } catch (error) {
            Logger.error('prepareOrdersData:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to calculate variance
    * @param {Object} data Data
    */
    calculateVariance (data) {
        for (const i in data) {
            if (Object.hasOwnProperty.call(data, i)) {
                var yesterday = 0;
                var today = 0;
                let orderVariance = 0;
                yesterday = (data[i - 1] !== undefined) ? data[i - 1].total : 0;
                today = data[i].total;
                var orderValue = parseFloat(today) - parseFloat(yesterday);
                orderVariance = (parseFloat(yesterday) > 0) ? orderValue / parseFloat(yesterday) * 100 : orderValue;
                data[i].variance = `${Math.abs(orderVariance).toFixed(2)}%`;
                data[i].varianceType = (orderVariance > 0);
                data[i].yesterdayValue = yesterday;
            }
        }
        return data;
    }

    getDatesDiff (startDate, endDate) {
        const getDateAsArray = date => {
            return moment(date.split(/\D+/), 'YYYY-MM-DD');
        };
        const diff = getDateAsArray(endDate).diff(getDateAsArray(startDate), 'days') + 1;
        const dates = [];
        for (let i = 0; i < diff; i++) {
            const nextDate = getDateAsArray(startDate).add(i, 'day');
            dates.push({
                date: nextDate.format('MM/DD/YYYY'),
                total: 0,
                yesterdayValue: 0
            });
        }
        return dates;
    }

    dateFormat (date) {
        return `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
    }
}
module.exports.getDashboardOrdersHandler = async (event, context, callback) =>
    new GetDashboardOrders().getDashboardOrders(event, context, callback);
