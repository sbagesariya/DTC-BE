const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const constant = require('../../utils/constant');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddEstimatedDate class
 */
class AddEstimatedDate {

    /**
     * Function to get all orders to update estimated date
     *
     * @param {*} req
     * @param {*} context
     * @param {*} callback
     */
    async addDate (req, context, callback) {
        try {
            var params = {
                TableName: 'Order'
            };
            const orders = await docClient.scan(params).promise();
            this.updateOrdersEstDate(orders.Items);
            return callback(null, Utils.successResponse({ }));
        } catch (error) {
            Logger.error('AddEstimatedDate:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add orders estimated delivery date
     * @param {*} orders
     */
    updateOrdersEstDate (orders) {
        var params = {
            TableName: 'Order'
        };
        orders.forEach(async (value) => {
            const brandName = value.brand_name;
            const status = value.order_status;
            const estDeliveryDate = await this.addDays(value.createdAt, constant.COMMON.STANDARD_EST_DEL_DATE);
            const estDeliveryDateFormated = this.dateFormat(estDeliveryDate);
            params.Key = { brand_id: value.brand_id, createdAt: value.createdAt };
            params.UpdateExpression = 'set estimated_delivery_date = :estimated_delivery_date,' +
            'search_estimated_delivery_date =:search_estimated_delivery_date,' +
            'search_brand_name =:search_brand_name, search_status =:search_status,' +
            'sort_brand_name =:sort_brand_name';
            params.ExpressionAttributeValues = {
                ':estimated_delivery_date': estDeliveryDate.getTime(),
                ':search_estimated_delivery_date': estDeliveryDateFormated,
                ':search_brand_name': brandName.toLowerCase(),
                ':search_status': status.toLowerCase(),
                ':sort_brand_name': brandName.toLowerCase()
            };
            await docClient.update(params).promise();
        });
    }

    /**
     * function to add days to date
     *
     * @param {*} date
     * @param {*} days
     */
    async addDays (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * Function to format date
     *
     * @param {*} date
     */
    dateFormat (date) {
        return `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
    }
}

module.exports.addEstimatedDateHandler = async (event, context, callback) =>
    new AddEstimatedDate().addDate(event, context, callback);
