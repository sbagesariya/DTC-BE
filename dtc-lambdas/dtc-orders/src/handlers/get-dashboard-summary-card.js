const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const ElasticSearch = require('../../utils/es-config');
const Constants = require('../../utils/constants');
const GoogleAnalytics = require('../../utils/ga-config');
const ParameterStore = require('../../utils/ssm');
const moment = require('moment');

class GetDashboardSummaryCard {

    /**
    * @desc This function is being used to get dashboard summary card
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.domain Domain
    */
    async getDashboarSummaryCard (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const result = await this.prepareCardData(body);
                return Utils.successResponse(result);
            } catch (error) {
                Logger.error('getDashboarSummaryCard:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getDashboarSummaryCard:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate get dashboard orders request
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    * @param {String} req.body.domain Domain
    */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    /**
    * @desc This function is being prepare card data
    * @param {Object} body RequestBody
    */
    async prepareCardData (body) {
        const brandId = body.brand_id;
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const date = new Date();
        const todayDate = this.dateFormat(date);
        const todaySales = await this.prepareESQuery(brandId, todayDate);

        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = this.dateFormat(yesterday);
        const yesterdaySales = await this.prepareESQuery(brandId, yesterdayDate);

        const salesVariance = this.calculateVariance(todaySales.totalSales, yesterdaySales.totalSales);
        const orderVariance = this.calculateVariance(todaySales.totalOrders, yesterdaySales.totalOrders);

        const lastEndDate = this.dateFormat(new Date(date.setDate(date.getDate() - 1)), true);
        const lastStartDate = this.dateFormat(new Date(date.setDate(date.getDate() - 6)), true);
        const lastWeekEndDate = this.dateFormat(new Date(date.setDate(date.getDate() - 1)), true);
        const lastWeekStartDate = this.dateFormat(new Date(date.setDate(date.getDate() - 6)), true);
        const prevWeeklyUsers = await this.prepareGAQuery(body, lastWeekStartDate, lastWeekEndDate);
        const weeklyUsers = await this.prepareGAQuery(body, lastStartDate, lastEndDate);
        const userVariance = this.calculateVariance(weeklyUsers, prevWeeklyUsers);
        return [
            {
                title: 'Today\'s Sales',
                value: (todaySales.totalSales > 0) ? formatter.format(parseFloat(todaySales.totalSales)) : null,
                variance: `${Math.abs(salesVariance).toFixed(2)}%`,
                varianceType: (salesVariance > 0)
            },
            {
                title: 'Today\'s Orders',
                value: (todaySales.totalOrders > 0) ? todaySales.totalOrders : null,
                variance: `${Math.abs(orderVariance).toFixed(2)}%`,
                varianceType: (orderVariance > 0)
            },
            {
                title: 'Weekly Visitors',
                value: (weeklyUsers > 0) ? weeklyUsers : null,
                variance: `${Math.abs(userVariance).toFixed(2)}%`,
                varianceType: (userVariance > 0)
            }
        ];
    }

    /**
    * @desc This function is being used to prepare get today's orders total and sales from ES
    * @param {String} brandId Brand Id
    * @param {String} placedOn placed On
    */
    async prepareESQuery (brandId, placedOn) {
        try {
            const client = await ElasticSearch.connection();
            const { body } = await client.search({
                index: 'order-index',
                body: {
                    _source: [
                        'sort_total',
                        'brand_id',
                        'search_placed_on'
                    ],
                    query: {
                        bool:
                        {
                            must:
                            [
                                { match: { 'brand_id.keyword': brandId } },
                                { match: { 'search_placed_on.keyword': placedOn } }
                            ]
                        }
                    },
                    aggs: {
                        totalSales: { 'sum': { 'field': 'sort_total' } }
                    },
                    size: Constants.ES_DEFAULT_SIZE
                }
            });

            return {
                totalSales: (body.aggregations.totalSales.value) ? body.aggregations.totalSales.value : 0,
                totalOrders: (body.hits.total.value) ? body.hits.total.value : 0
            };
        } catch (error) {
            Logger.error('prepareESQuery:catch', error);
            return Utils.errorResponse(error);
        }
    }

    dateFormat (date, defaultFormat = false) {
        if (defaultFormat) {
            return moment(date).format('YYYY-MM-DD');
        } else {
            return moment(date).format('MM/DD/YYYY');
        }
    }

    /**
    * @desc This function is being used to get today's users
    * @param {Object} body RequestBody
    * @param {Object} startDate startDate
    * @param {Object} endDate endDate
    */
    async prepareGAQuery (body, startDate, endDate) {
        const analyticsDataClient = await GoogleAnalytics.connection();
        const propertyId = await ParameterStore.getValue('property_id');
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate,
                    endDate
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

    /**
    * @desc This function is being used to calculate variance
    * @param {String} today Today
    * @param {String} yesterday Yesterday
    */
    calculateVariance (today, yesterday) {
        let variance = 0;
        var value = parseFloat(today) - parseFloat(yesterday);
        variance = (parseFloat(yesterday) > 0) ? value / parseFloat(yesterday) * 100 : value;
        return variance;
    }
}
module.exports.getDashboardSummaryCardHandler = async (event, context, callback) =>
    new GetDashboardSummaryCard().getDashboarSummaryCard(event, context, callback);
