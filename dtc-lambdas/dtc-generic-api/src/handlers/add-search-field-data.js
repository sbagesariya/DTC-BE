const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class AddSearchFieldData {

    /**
    * @desc This function is being used to add search filed data
    */
    async addSearchFieldData (req, context, callback) {
        try {
            var params = {
                TableName: 'Order'
            };
            const orders = await docClient.scan(params).promise();
            this.updateSearchFieldData(orders.Items);
            return callback(null, Utils.successResponse({}, Message.COMMON.INSERTED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('addSearchFieldData:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add search filed data
     * @param {*} orders
     */
    updateSearchFieldData (orders) {
        var params = {
            TableName: 'Order'
        };
        orders.forEach(async (data) => {
            if (data.brand_id !== '' && data.createdAt !== '') {
                const date = new Date(data.createdAt);
                const placedOn = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
                const sortTotal = parseFloat(data.payment_detail.total);
                params.Key = { brand_id: data.brand_id, createdAt: data.createdAt };
                params.UpdateExpression = `SET sort_order_id = :sort_order_id, search_order_id = :search_order_id,
                    search_user_name = :search_user_name, search_state = :search_state, search_total = :sort_total,
                    sort_total = :sort_total, retailer = :retailer, search_retailer = :search_retailer,
                    sort_state = :sort_state, search_placed_on = :search_placed_on`;
                params.ExpressionAttributeValues = {
                    ':sort_order_id': data.order_id,
                    ':search_order_id': (data.order_id).toLowerCase(),
                    ':search_user_name': `${(data.user_detail.first_name).toLowerCase()} ${(data.user_detail.last_name).toLowerCase()}`,
                    ':search_state': (data.delivery_address.state) ? (data.delivery_address.state).toLowerCase() : 'ca',
                    ':sort_total': (!isNaN(sortTotal)) ? sortTotal : 0.00,
                    ':retailer': data.brand_name,
                    ':search_retailer': (data.brand_name).toLowerCase(),
                    ':sort_state': (data.delivery_address.state) ? data.delivery_address.state : 'CA',
                    ':search_placed_on': placedOn
                };
                await docClient.update(params).promise();
            }
        });
    }
}

module.exports.addSearchFieldDataOrderTableHandler = async (event, context, callback) =>
    new AddSearchFieldData().addSearchFieldData(event, context, callback);
