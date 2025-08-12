const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name GetRetailerTransactionHistory class
 * @author GrowExx
 */

class GetRetailerTransactionHistory {

    /**
     * @desc This function is being used to to get retailer transaction history
     * @author GrowExx
     * @since 21/07/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.retailer_id Retailer Id
     */
    async getRetailerTransactionHistory (req, context, callback) {
        const body = JSON.parse(req.body);
        if (!body.retailer_id) {
            return Utils.errorResponse(Message.RETAILER_ID_REQUIRED);
        }
        try {
            const limit = body.limit || 9;
            const params = await this.prepareTransactionsParams(body);
            const scanResults = [];
            let items;
            let resultCount = 0;
            const Limit = limit;
            do {
                items = await docClient.query(params).promise();
                await this.prepareTransactionsItem(items, scanResults);
                params.ExclusiveStartKey = items.LastEvaluatedKey;
                params.Limit = Limit - scanResults.length;
                resultCount += items.Count;
            } while (scanResults.length < Limit && items.LastEvaluatedKey);
            return callback(null, Utils.successResponse({
                data: scanResults,
                total_count: await this.getTotalOrderCount(params),
                lastKey: items.LastEvaluatedKey || '',
                result_count: resultCount
            }));
        } catch (error) {
            Logger.error('getRetailerTransactionHistory:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to prepare retailer transaction Params
     * @author GrowExx
     * @since 21/07/2021
     * @param {Object} req.body RequestBody
     */
    async prepareTransactionsParams (body) {
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            IndexName: 'retailer_id-createdAt-index',
            ExpressionAttributeValues: {
                ':retailer_id': body.retailer_id
            },
            ScanIndexForward: false,
            ProjectionExpression: 'retailer_id, order_id, search_placed_on, brand_id, brand_name, sort_total, payment_detail',
            Limit: body.limit || 9
        };
        if (body.lastKey) {
            params.ExclusiveStartKey = body.lastKey;
        }
        return params;
    }

    /**
     * @desc This function is being used to get total order count
     * @author GrowExx
     * @since 21/07/2021
     * @param {Object} params params
     */
    async getTotalOrderCount (params) {
        delete params.ProjectionExpression;
        delete params.Limit;
        delete params.ExclusiveStartKey;
        delete params.ScanIndexForward;
        params.Select = 'COUNT';
        const orderData = await docClient.query(params).promise();
        return orderData.Count;
    }

    /**
     * @desc This function is being used to get end day of total
     * @author GrowExx
     * @since 22/07/2021
     * @param {Object} item item
     * @param {Object} scanResults scanResults
     */
    async getEndOfDayTotal (item, scanResults) {
        const orderId = await this.getLastRecords(item.retailer_id, item.search_placed_on);
        if (orderId === item.order_id) {
            const params = {
                TableName: 'Order',
                KeyConditionExpression: 'retailer_id = :retailer_id',
                FilterExpression: 'search_placed_on = :search_placed_on',
                ProjectionExpression: 'sort_total, payment_detail',
                IndexName: 'retailer_id-index',
                ExpressionAttributeValues: {
                    ':retailer_id': item.retailer_id,
                    ':search_placed_on': item.search_placed_on
                }
            };
            const orderData = await docClient.query(params).promise();
            const dayOftotal = orderData.Items.reduce((a, b) => {
                return a + (b.sort_total - parseFloat(b.payment_detail.credit_card_fee));
            }, 0);
            const dayTotal = { is_total: true, order_date: item.search_placed_on, value: dayOftotal };
            scanResults.push(dayTotal);
        }
        return scanResults;
    }

    /**
     * @desc This function is being used to get retailer transaction last records
     * @author GrowExx
     * @since 22/07/2021
     * @param {String} retailerId retailer_id
     * @param {String} placedOn placedOn
     */
    async getLastRecords (retailerId, placedOn) {
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            FilterExpression: 'search_placed_on = :search_placed_on',
            IndexName: 'retailer_id-createdAt-index',
            ExpressionAttributeValues: {
                ':retailer_id': retailerId,
                ':search_placed_on': placedOn
            },
            ScanIndexForward: true,
            ProjectionExpression: 'order_id, search_placed_on, sort_total'
        };
        const orderData = await docClient.query(params).promise();
        return orderData.Items[0].order_id;
    }

    /**
     * @desc This function is being used to prepare retailer transaction Items
     * @author GrowExx
     * @since 08/09/2021
     * @param {Object} items items
     * @param {Object} scanResults scanResults
     */
    async prepareTransactionsItem (items, scanResults) {
        for (const key in items.Items) {
            if (Object.hasOwnProperty.call(items.Items, key)) {
                const item = items.Items[key];
                scanResults.push(item);
                await this.getEndOfDayTotal(item, scanResults);
            }
        }
        return scanResults;
    }
}
module.exports.getRetailerTransactionHistoryHandler = async (event, context, callback) =>
    new GetRetailerTransactionHistory().getRetailerTransactionHistory(event, context, callback);
