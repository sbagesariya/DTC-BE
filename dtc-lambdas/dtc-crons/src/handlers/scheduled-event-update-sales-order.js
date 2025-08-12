const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Constant = require('../../utils/constant');
const CommonService = require('./../services/common.service');
const NavigatorService = require('./../services/navigator.service');

/**
 * @name ThirdPartyUpdateSalesOrder class
 */
class ThirdPartyUpdateSalesOrder {

    /**
     * @desc This function is being used to get & update sales order status, tracking_company and tracking_id
     * @author GrowExx
     * @since 23/03/2022
     */
    async updateSalesOrder (req, context, callback) {
        try {
            const orders = await this.getOrders();
            for (const key in orders) {
                if (Object.hasOwnProperty.call(orders, key)) {
                    const order = orders[key];
                    await this.updateOrderDetails(order);
                }
            }
            return callback(null, Utils.successResponse());
        } catch (error) {
            Logger.error('updateSalesOrder:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to update sales order status, tracking_company and tracking_id
     * @author GrowExx
     * @since 23/03/2022
     * @param {Object} updatedOrder Updated Order Details
     * @param {Object} order Order details
     */
    prepareQuery (updatedOrder, order) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: order.brand_id,
                createdAt: order.createdAt
            }
        };
        params.UpdateExpression = 'SET order_status = :order_status, search_status = :search_status';
        params.ExpressionAttributeValues = {
            ':order_status': Constant.NAVIGATOR.ORDER_STATUS[updatedOrder.order_status],
            ':search_status': Constant.NAVIGATOR.ORDER_STATUS[updatedOrder.order_status].toLowerCase()
        };
        if (updatedOrder.carrier_id) {
            params.UpdateExpression = params.UpdateExpression + ', tracking_company = :tracking_company';
            params.ExpressionAttributeValues[':tracking_company'] = updatedOrder.carrier_id;
        }
        if (updatedOrder['delivery_reference_#']) {
            params.UpdateExpression = params.UpdateExpression + ', tracking_id = :tracking_id';
            params.ExpressionAttributeValues[':tracking_id'] = updatedOrder['delivery_reference_#'];
        }
        return params;
    }

    /**
     * @desc This function is being used to get orders which are not with status delivered or Canceled
     * @since 23/03/2022
     */
    async getOrders () {
        let allData = [];
        const getAllData = async (params) => {
            const data = await docClient.scan(params).promise();
            if (data.Items.length > 0) {
                allData = [...allData, ...data.Items];
            }
            if (data.LastEvaluatedKey) {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                return await getAllData(params);

            } else {
                return data;
            }
        };
        const params = {
            TableName: 'Order',
            FilterExpression: 'attribute_exists(sales_order_id) AND order_status <> :order_status1 AND order_status <> :order_status2',
            ExpressionAttributeValues: {
                ':order_status1': Constant.ORDER_CANCELLED,
                ':order_status2': Constant.ORDER_DELIVERED
            }
        };
        await getAllData(params);
        if (allData.length) {
            return allData;
        } else {
            throw Message.SALES_ORDER_NOT_FOUND;
        }
    }

    /**
     * @desc This function is being used to get & update sales order status, tracking_company and tracking_id
     * @since 29/03/2022
     * @param {Object} orders Orders
     */
    async updateOrderDetails (order) {
        const updatedOrders = await NavigatorService.getNavigatorOrderStatus(order.sales_order_id);
        if (updatedOrders && Constant.NAVIGATOR.ORDER_STATUS[updatedOrders.order_status]) {
            const query = this.prepareQuery(updatedOrders, order);
            await docClient.update(query).promise();
            if (Constant.NAVIGATOR.ORDER_STATUS[updatedOrders.order_status] === Constant.ORDER_CANCELLED) {
                CommonService.notifyCustomer(order, Constant.ORDER_CANCELLED);
            }
        }
    }
}
module.exports.ThirdPartyUpdateSalesOrderHandler = async (event, context, callback) =>
    new ThirdPartyUpdateSalesOrder().updateSalesOrder(event, context, callback);
