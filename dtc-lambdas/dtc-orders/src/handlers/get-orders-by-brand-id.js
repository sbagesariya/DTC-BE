const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetOrdersByBrand {

    /**
    * @desc This function is being used to to get all orders
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.brand_id Brand Id
    */
    async getOrdersByBrand (req, context, callback) {
        const body = JSON.parse(req.body);
        const limit = body.limit || 6;
        const userType = body.user_type || 'brand';
        let params = {};
        if (userType === 'retailer') {
            if (!body.retailer_id) {
                return callback(null, Utils.errorResponse(Message.RETAILER_ID_REQUIRED));
            }
            params = await this.prepareRetailerParams(body);
        } else {
            if (!body.brand_id) {
                return callback(null, Utils.errorResponse(Message.BRAND_ID_REQUIRED));
            }
            params = await this.prepareBrandParams(body);
        }
        try {
            const scanResults = [];
            let items;
            let resultCount = 0;
            const Limit = limit;
            do {
                items = await docClient.query(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
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
            Logger.error('getCmsOrders:catch', error);
            return callback(null, Utils.errorResponse('', error));
        }

    }

    /**
    * @desc This function is being used to get total order count
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
    * @desc This function is being used to prepare brand Params
    * @param {Object} req.body RequestBody
    */
    async prepareBrandParams (body) {
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            },
            ProjectionExpression: `order_id, brand_id, order_status, user_detail, payment_detail, createdAt,
            brand_name, user_email, product_detail, delivery_address, search_placed_on, retailer`,
            Limit: body.limit || 6
        };
        if (body.order) {
            params.ScanIndexForward = (body.order === 'asc');
        }
        if (body.sort) {
            const sort = body.sort;
            params.IndexName = `brand_id-${sort}-index`;
        }
        if (body.universal_search) {
            params.FilterExpression = `contains(search_user_name, :universal_search) or
            contains(search_order_id, :universal_search) or contains(search_state, :universal_search) or
            contains(search_placed_on, :universal_search) or contains(search_retailer, :universal_search)`;
            params.ExpressionAttributeValues[':universal_search'] = (body.universal_search).toLowerCase();
            const universalSearch = parseInt(body.universal_search);
            if (!isNaN(universalSearch)) {
                params.FilterExpression += ' or search_total = :search_total';
                params.ExpressionAttributeValues[':search_total'] = universalSearch;
            }
        }
        if (body.lastKey) {
            params.ExclusiveStartKey = body.lastKey;
        }
        return params;
    }

    /**
    * @desc This function is being used to prepare retailer Params
    * @param {Object} req.body RequestBody
    */
    async prepareRetailerParams (body) {
        const params = {
            TableName: 'Order',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': body.retailer_id
            },
            IndexName: 'retailer_id-index',
            ProjectionExpression: `order_id, retailer_id, retailer, brand_id, order_status, user_detail, payment_detail,
            createdAt, sort_total, brand_name, user_email, product_detail, delivery_address, search_placed_on,
            estimated_delivery_date, search_estimated_delivery_date`,
            Limit: body.limit || 6
        };
        if (body.order) {
            params.ScanIndexForward = (body.order === 'asc');
        }
        if (body.sort) {
            const sort = body.sort;
            params.IndexName = `retailer_id-${sort}-index`;
        }
        let filter = 'attribute_exists(order_status)';
        if (body.universal_search) {
            filter += `and (contains(search_user_name, :universal_search) or
            contains(search_order_id, :universal_search) or contains(search_estimated_delivery_date, :universal_search) or
            contains(search_placed_on, :universal_search) or contains(search_status, :universal_search) or
            contains(search_brand_name, :universal_search)`;
            params.ExpressionAttributeValues[':universal_search'] = (body.universal_search).toLowerCase();
            const universalSearch = parseInt(body.universal_search);
            if (!isNaN(universalSearch)) {
                filter += ' or search_total = :search_total';
                params.ExpressionAttributeValues[':search_total'] = universalSearch;
            }
            filter += ')';
        }
        if (body.status) {
            filter += 'and (order_status = :order_status)';
            params.ExpressionAttributeValues[':order_status'] = body.status;
        }
        if (filter != '') {
            params.FilterExpression = filter;
        }
        if (body.lastKey) {
            params.ExclusiveStartKey = body.lastKey;
        }
        return params;
    }
}
module.exports.getOrdersByBrandHandler = async (event, context, callback) =>
    new GetOrdersByBrand().getOrdersByBrand(event, context, callback);
