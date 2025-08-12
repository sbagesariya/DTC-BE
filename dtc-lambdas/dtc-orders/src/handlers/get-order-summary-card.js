const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const moment = require('moment');

class GetOrderSummaryCard {

    /**
    * @desc This function is being used to to get all orders
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    */
    async getOrderSummaryCard (req) {
        if (!req.pathParameters.brand_id) {
            return Utils.errorResponse(Message.BRAND_ID_REQUIRED);
        }
        try {
            const brandId = req.pathParameters.brand_id;
            const result = await this.prepareCardData(brandId);
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getOrderSummaryCard:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being prepare card data
    * @param {String} brandId Brand Id
    */
    async prepareCardData (brandId) {
        const todaysCard = await this.getTodaysCard(brandId);
        const monthsCard = await this.getThisMonthCard(brandId);
        const salesCard = await this.getSalesCard(brandId);
        return [
            {
                title: 'Today\'s Orders',
                value: todaysCard.todayTotal,
                variance: todaysCard.variance,
                varianceType: todaysCard.varianceType
            },
            {
                title: 'This Month\'s Orders',
                value: monthsCard.monthTotal,
                variance: monthsCard.variance,
                varianceType: monthsCard.varianceType
            },
            {
                title: '# of Products Sold',
                value: salesCard.productTotal,
                yearToDate: 'Year to Date'
            },
            {
                title: 'Total Sales',
                value: salesCard.totalSales,
                yearToDate: 'Year to Date',
                cssClass: 'u-pg-mt-1'
            }
        ];
    }

    /**
    * @desc This function is being used to get todays order card
    * @param {String} brandId Brand Id
    */
    async getTodaysCard (brandId) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const today = new Date();
        const todayDate = this.dateFormat(today);
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'search_placed_on = :today_date',
            ProjectionExpression: 'sort_total',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':today_date': todayDate
            }
        };
        const orderData = await docClient.query(params).promise();
        const sortTotal = orderData.Items.map(obj => obj.sort_total);
        const todayTotal = sortTotal.reduce((a, b) => a + b, 0);

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDate = this.dateFormat(yesterday);
        const paramsYest = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'search_placed_on = :yesterday_date',
            ProjectionExpression: 'sort_total',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':yesterday_date': yesterdayDate
            }
        };
        const orderDataYest = await docClient.query(paramsYest).promise();
        const sortTotalYest = orderDataYest.Items.map(obj => obj.sort_total);
        const yesterdayTotal = sortTotalYest.reduce((a, b) => a + b, 0);
        const decreaseValue = todayTotal - yesterdayTotal;
        const variance = (yesterdayTotal > 0) ? (decreaseValue / yesterdayTotal) * 100 : decreaseValue;
        return {
            'todayTotal': (todayTotal > 0) ? formatter.format(parseFloat(todayTotal)) : null,
            'variance': `${Math.abs(variance).toFixed(2)}%`,
            'varianceType': (variance > 0)
        };
    }

    /**
    * @desc This function is being used to get this month order card
    * @param {String} brandId Brand Id
    */
    async getThisMonthCard (brandId) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        firstDay = this.dateFormat(firstDay);
        const todayDate = this.dateFormat(date);
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'search_placed_on BETWEEN :firstDay AND :todayDate',
            ProjectionExpression: 'sort_total',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':firstDay': firstDay,
                ':todayDate': todayDate
            }
        };
        const orderData = await docClient.query(params).promise();
        const sortTotal = orderData.Items.map(obj => obj.sort_total);
        const thisMonthTotal = sortTotal.reduce((a, b) => a + b, 0);

        let prevMonthFirstDate = new Date(date.getFullYear() - (date.getMonth() > 0 ? 0 : 1), (date.getMonth() - 1 + 12) % 12, 1);
        prevMonthFirstDate = new Date(prevMonthFirstDate.getFullYear(), prevMonthFirstDate.getMonth(), 1);
        prevMonthFirstDate = this.dateFormat(prevMonthFirstDate);
        let prevMonthLastDate = new Date(date.getFullYear(), date.getMonth(), 0);
        prevMonthLastDate = new Date(prevMonthLastDate.getFullYear(), prevMonthLastDate.getMonth() + 1, 0);
        prevMonthLastDate = this.dateFormat(prevMonthLastDate);

        const paramsLast = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'search_placed_on BETWEEN :prevMonthFirstDate AND :prevMonthLastDate',
            ProjectionExpression: 'sort_total',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':prevMonthFirstDate': prevMonthFirstDate,
                ':prevMonthLastDate': prevMonthLastDate
            }
        };
        const orderDataLast = await docClient.query(paramsLast).promise();
        const sortTotalLast = orderDataLast.Items.map(obj => obj.sort_total);
        const lastMonthTotal = sortTotalLast.reduce((a, b) => a + b, 0);
        var decreaseValue = thisMonthTotal - lastMonthTotal;
        const variance = (lastMonthTotal > 0) ? (decreaseValue / lastMonthTotal) * 100 : decreaseValue;
        return {
            'monthTotal': (thisMonthTotal > 0) ? formatter.format(parseFloat(thisMonthTotal)) : null,
            'variance': `${Math.abs(variance).toFixed(2)}%`,
            'varianceType': (variance > 0)
        };
    }

    /**
    * @desc This function is being used to get products sales card data
    * @param {String} brandId Brand Id
    */
    async getSalesCard (brandId) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const numFormatter = new Intl.NumberFormat('en-US');
        const date = new Date();
        let firstOfYear = new Date(date.getFullYear(), 0, 1);
        firstOfYear = this.dateFormat(firstOfYear);
        const todayDate = this.dateFormat(date);
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'search_placed_on BETWEEN :firstOfYear AND :todayDate',
            ProjectionExpression: 'sort_total, product_detail',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':firstOfYear': firstOfYear,
                ':todayDate': todayDate
            }
        };
        const orderData = await docClient.query(params).promise();
        let productTotal = 0;
        let totalSales = 0;
        orderData.Items.forEach(async (data) => {
            productTotal += data.product_detail.length;
            totalSales += data.sort_total;
        });
        return {
            'productTotal': (productTotal > 0) ? numFormatter.format(productTotal) : null,
            'totalSales': (totalSales > 0) ? formatter.format(parseFloat(totalSales)) : null
        };
    }

    dateFormat (date) {
        return moment(date).format('MM/DD/YYYY');
    }
}
module.exports.getOrderSummaryCardHandler = async (event, context, callback) =>
    new GetOrderSummaryCard().getOrderSummaryCard(event, context, callback);
