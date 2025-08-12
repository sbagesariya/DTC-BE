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
 */
class UpdateOrderStatus {
    async updateOrderStatus (req, context, callback) {
        try {
            const body = JSON.parse(req.body);
            const order = await this.validateRequest(body);
            const brandDetail = await CommonService.getBrandDetails(body.brand_id, 'brand_website');
            var params = {
                TableName: 'Order',
                Key: {
                    brand_id: body.brand_id,
                    createdAt: body.createdAt
                },
                UpdateExpression: 'SET order_status = :order_status, search_status = :search_status, brand_website =:brand_website',
                ConditionExpression: 'order_id = :order_id',
                ExpressionAttributeValues: {
                    ':order_status': body.order_status,
                    ':search_status': (body.order_status).toLowerCase(),
                    ':order_id': body.order_id,
                    ':brand_website': brandDetail.brand_website
                }
            };
            await docClient.update(params).promise();
            const retailerDetail = await CommonService.getRetailerDetails(order.retailer_id || order.fulfillment_center_id,
                'user_id, first_name, last_name, stripe_connect_account');
            switch (body.order_status) {
                case Constant.SHIPPED:
                    this.prepareMailData(body, order, retailerDetail);
                    break;
                case Constant.RECEIVED:
                    await this.completePayment(body, order, retailerDetail);
                    break;
                case Constant.CANCELLED:
                    await this.refundProcess(body, order);
                    this.prepareMailData(body, order, retailerDetail);
                    break;
                default:
                    break;
            }
            return callback(null, Utils.successResponse({ order_id: body.order_id }));
        } catch (error) {
            Logger.error('updateOrderStatus:catch', error);
            return callback(null, Utils.errorResponse(error));
        }
    }

    /**
      * @desc This function is being used to validate update order status request
      * @param {Object} req Request
      * @param {Object} req.body RequestBody
      * @param {String} req.body.order_id Order Id
      * @param {String} req.body.retailer_id Retailer Id
      * @param {String} req.body.order_status Order Status
      */
    async validateRequest (body) {
        if (!body.order_id) {
            throw Message.ORDER_ID_REQUIRED;
        } else if (!body.retailer_id) {
            throw Message.RETAILER_ID_REQUIRED;
        } else if (!body.order_status) {
            throw Message.ORDER_STATUS_REQUIRE;
        } else {
            const params = {
                TableName: 'Order',
                KeyConditionExpression: 'order_id = :order_id',
                ExpressionAttributeValues: {
                    ':order_id': body.order_id
                },
                Limit: 1,
                IndexName: 'order_id-index'
            };
            const orderData = await docClient.query(params).promise();
            if (orderData.Count === 0) {
                throw Message.ORDER_NOT_EXISTS;
            } else if (body.order_status === orderData.Items[0].order_status) {
                throw `Order is already ${body.order_status}`;
            } else {
                const items = orderData.Items[0];
                body.brand_id = items.brand_id;
                body.createdAt = items.createdAt;
                return items;
            }
        }
    }

    /**
     * @desc This function is being used send email when order is shipped from the retailer
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.user_email User email
     */
    async prepareMailData (body, orderData, retailerDetail) {
        const templateResult = await CommonService.getBrandActiveTemplate(body.brand_id);
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        orderData.fulfilledBy = retailerDetail.length ? `${retailerDetail[0].first_name} ${retailerDetail[0].last_name}` : '-';
        orderData.logo = templateResult.Items[0].logo;
        orderData.status = body.order_status;
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
        if (body.order_status === Constant.CANCELLED) {
            const reorderUrl = `${orderData.domain_name}/checkout/${body.brand_id}/${body.order_id}`;
            orderData.emailBody = {
                row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, ` +
                    'your order cannot be fulfilled at this time.',
                row_2: 'Payment has NOT been processed.',
                row_3: 'If you want to reorder with a new retailer please proceed to ' +
                    `<a href="${reorderUrl}">Click Here</a>. Please be aware changes in prices may occur.`
            };
        } else {
            orderData.emailBody = {
                row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, your order has been shipped!`,
                row_2: 'Below are your order details and tracking number.'
            };
        }
        orderData.trackingDetail = {
            trackingNo: '#67579-H897',
            line_1: 'ETA: 4 – 7 Business Days'
        };
        const templateData = orderData;
        const email = {
            to: [templateData.user_email],
            from: Constant.PLACE_ORDER.SOURCE_EMAIL
        };
        const subject = `Order ${orderData.status} ${templateData.brand_name} #${body.order_id}`;
        EmailService.createTemplate('OrderMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    async refundProcess (body, orderData) {
        try {
            if (!orderData.payment_confirmation_number && orderData.payment_detail.stripe_payment_intent_id) {
                const refund = await CommonService.getStripeKeyAndRefund(orderData);
                CommonService.updateRefundStatus(body, refund);
            } else {
                const result = await CommonService.refundTransaction(orderData);
                CommonService.upateOrderStatus(body, result, 'refund_confirmation_number');
            }
        } catch (error) {
            Logger.error('refundProcess:validateRequest', error);
        }
    }

    /**
     * Function to comeplte autorize payment
     * @param {*} orderData
     */
    async completePayment (body, orderData, retailerDetail) {
        try {
            if (retailerDetail.length && retailerDetail[0].stripe_connect_account) {
                const data = await CommonService.transferRetailePayment(orderData, retailerDetail[0].stripe_connect_account);
                CommonService.upateOrderStatus(body, data, 'payment_confirmation_number');
            }
        } catch (error) {
            Logger.error('completePayment:validateRequest', error);
            body.order_status = Constant.CANCELLED;
            CommonService.upateOrderStatus(body);
            this.prepareMailData(body, orderData, retailerDetail);
        }
    }
}
module.exports.updateOrderStatusHandler = async (event, context, callback) =>
    new UpdateOrderStatus().updateOrderStatus(event, context, callback);
