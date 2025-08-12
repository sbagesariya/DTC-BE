const OrderModel = require('../../model/order.model');
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const EmailService = require('./../../utils/email/email-service');
const TemplateHTML = require('../../utils/email/order-mail-template');
const CommonService = require('./../services/common.service');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
/**
 * @name UpdateOrderStatus class
 * @author Innovify
 */
class UpdateOrderStatus {
    updateOrderStatus (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                const createdAt = new Date(body.createdAt);
                var params = {
                    TableName: 'Order',
                    Key: {
                        brand_id: body.brand_id,
                        createdAt: createdAt.getTime()
                    },
                    UpdateExpression: 'SET order_status = :order_status, search_status = :search_status',
                    ConditionExpression: 'order_id = :order_id',
                    ExpressionAttributeValues: {
                        ':order_status': body.order_status,
                        ':search_status': (body.order_status).toLowerCase(),
                        ':order_id': body.order_id
                    }
                };
                await docClient.update(params).promise();
                if (body.order_status === 'Shipped') {
                    await this.prepareMailData(body);
                }
                return callback(null, Utils.successResponse({ order_id: body.order_id }));
            } catch (error) {
                Logger.error('updateOrder:catch', error);
                return callback(null, Utils.errorResponse(error));
            }
        }).catch((err) => {
            Logger.error('updateOrder:validateRequest', err);
            return callback(null, Utils.errorResponse(err));
        });
    }

    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.order_id) {
                reject(Message.ORDER.ORDER_ID_REQUIRE);
            } else if (!body.order_status) {
                reject(Message.ORDER.ORDER_STATUS_REQUIRE);
            } else if (!body.brand_id) {
                reject(Message.ORDER.BRAND_ID_REQUIRED);
            } else if (!body.createdAt) {
                reject(Message.ORDER.CREATED_AT_REQUIRED);
            } else {
                const order = await OrderModel.query('order_id').using('order_id-index').eq(body.order_id).exec();
                if (order.count === 0) {
                    reject(Message.ORDER.ORDER_NOT_EXISTS);
                } else {
                    resolve();
                }
            }
        });
    }

    /**
     * @desc This function is being used send email when order is shipped from the retailer
     * @author Innovify
     * @since 11/01/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.user_email User email
     */
    async prepareMailData (body) {
        var query = OrderModel.query('order_id').using('order_id-index').eq(body.order_id);
        const templateResult = await CommonService.getBrandActiveTemplate(body.brand_id);
        const result = await query.exec();
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const orderData = result[0];
        orderData.logo = templateResult.Items[0].logo;
        orderData.status = 'Shipped';
        orderData.product_detail.forEach((element, index) => {
            orderData.product_detail[index].product_total
             = formatter.format(orderData.product_detail[index].price * orderData.product_detail[index].qty);
            orderData.product_detail[index].price = formatter.format(orderData.product_detail[index].price);
        });
        orderData.payment_detail.discount = formatter.format(parseFloat(orderData.payment_detail.discount));
        orderData.payment_detail.shipping_charge = formatter.format(parseFloat(orderData.payment_detail.shipping_charge));
        orderData.payment_detail.sub_total = formatter.format(parseFloat(orderData.payment_detail.sub_total));
        orderData.payment_detail.tax = formatter.format(parseFloat(orderData.payment_detail.tax));
        orderData.payment_detail.total = formatter.format(parseFloat(orderData.payment_detail.total));
        orderData.emailBody = {
            row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, your order has been shipped!`,
            row_2: 'Below are your order details and tracking number.'
        };
        orderData.trackingDetail = {
            trackingNo: '#67579-H897',
            line_1: 'ETA: 4 – 7 Business Days'
        };
        const templateData = orderData;
        const email = {
            to: [templateData.user_email],
            from: Constant.PLACE_ORDER.SOURCE_EMAIL
        };
        const subject = `Order Shipped ${templateData.brand_name} #${body.order_id}`;
        EmailService.createTemplate('OrderMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }
}
module.exports.UpdateOrderStatusHandler = async (event, context, callback) =>
    new UpdateOrderStatus().updateOrderStatus(event, context, callback);
