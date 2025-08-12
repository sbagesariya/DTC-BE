const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class ProductInventoryList {
    async productInventoryList (req, context, callback) {
        const body = JSON.parse(req.body);
        const limit = body.limit || 6;
        if (!body.retailer_id) {
            return Utils.errorResponse(Message.RETAILER_REQUIRED);
        }
        try {
            let params = {
                TableName: 'Inventory',
                KeyConditionExpression: 'retailer_id = :retailer_id',
                ExpressionAttributeValues: {
                    ':retailer_id': body.retailer_id
                },
                ProjectionExpression: `retailer_id, product_id, brand_id, retailer_product_id, product_name, brand_name, alcohol_type,
                    size, upc_code, unit_price, stock, sort_brand_name, createdAt`,
                Limit: limit
            };
            params = this.prepareQuery(body, params);
            const Limit = limit;
            if (body.lastKey) {
                params.ExclusiveStartKey = body.lastKey;
            }
            const scanResults = [];
            let items;
            let resultCount = 0;
            do {
                items = await docClient.query(params).promise();
                items.Items.forEach((item) => scanResults.push(item));
                params.ExclusiveStartKey = items.LastEvaluatedKey;
                params.Limit = Limit - scanResults.length;
                resultCount += items.Count;
            } while (scanResults.length < Limit && items.LastEvaluatedKey);
            return callback(null, Utils.successResponse({
                data: scanResults,
                total_count: await this.getTotalInventoryCount(params),
                lastKey: items.LastEvaluatedKey || '',
                result_count: resultCount
            }));
        } catch (error) {
            Logger.error('getCmsOrders:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to prepare the query
    */
    prepareQuery (body, params) {
        if (body.order && body.order !== '') {
            params.ScanIndexForward = (body.order === 'asc');
        }
        if (body.sort && body.sort !== '') {
            const sort = body.sort;
            params.IndexName = `retailer_id-${sort}-index`;
        }
        if (body.universal_search && body.universal_search !== '') {
            params.FilterExpression = `contains(search_retailer_product_id, :universal_search) or
            contains(search_product_name, :universal_search) or contains(search_brand_name, :universal_search) or
            contains(search_size, :universal_search) or contains(search_alcohol_type, :universal_search)`;
            params.ExpressionAttributeValues[':universal_search'] = (body.universal_search).toLowerCase();
            const universalSearch = parseInt(body.universal_search);
            if (!isNaN(universalSearch)) {
                params.FilterExpression += ' or upc_code = :search_number or stock = :search_number or unit_price = :search_number';
                params.ExpressionAttributeValues[':search_number'] = universalSearch;
            }
        }
        return params;
    }

    /**
    * @desc This function is being used to get total inventory count
    * @param {Object} params params
    */
    async getTotalInventoryCount (params) {
        delete params.ProjectionExpression;
        delete params.Limit;
        delete params.ExclusiveStartKey;
        delete params.ScanIndexForward;
        params.Select = 'COUNT';
        const orderData = await docClient.query(params).promise();
        return orderData.Count;
    }
}

module.exports.productInventoryListHandler = async (event, context, callback) =>
    new ProductInventoryList().productInventoryList(event, context, callback);
