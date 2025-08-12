const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/message');
const Constant = require('./../../utils/constants');
const Logger = require('./../../utils/logger');
const EmailService = require('./../../utils/email/email-service');
const TemplateHTML = require('./../../utils/email/order-mail-template');
const CommonService = require('./../services/common.service');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const NavigatorService = require('./../services/navigator.service');
/**
 * @name ConfirmOrder class
 * @author Innovify
 */
class ConfirmOrder {
    async confirmOrder (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            const templateResult = await CommonService.getBrandActiveTemplate(body.brand_id);
            for (const key in body.order) {
                if (Object.hasOwnProperty.call(body.order, key)) {
                    const ele = body.order[key];
                    ele.payment_detail.stripe_payment_method = body.stripe_payment_method;
                    const params = this.preprareQuery(body, ele);
                    await docClient.update(params).promise();
                    await this.getOrderDetails(ele, templateResult);
                }
            }
            return callback(null, Utils.successResponse({ order_id: body.order_id }));
        } catch (error) {
            Logger.error('updateOrder:catch', error);
            await this.getStripeKeyAndRefund(body);
            return callback(null, Utils.errorResponse(error));
        }
    }

    /**
     * @desc This function is being used to refund order payment and update order details
     * @since 25/10/2022
     * @param {Object} body Request body
     */
    async getStripeKeyAndRefund (body) {
        const refund = await CommonService.getStripeKeyAndRefund(body.order[0]);
        body.order.forEach(ele => {
            ele.brand_id = body.brand_id;
            CommonService.updateRefundStatus(ele, refund);
        });
    }

    /**
     * @desc This function is being used to get order detail
     * @since 07/10/2021
     * @param {Object} ele Request
     * @param {string} req.order_id Order Id
     * @param {String} req.body.user_email User email
     */
    async getOrderDetails (ele, templateResult) {
        var params = {
            TableName: 'Order',
            IndexName: 'order_id-index',
            KeyConditionExpression: '#order_id = :order_id',
            ExpressionAttributeNames: {
                '#order_id': 'order_id'
            },
            ExpressionAttributeValues: {
                ':order_id': ele.order_id
            }
        };
        const orderDetail = await docClient.query(params).promise();
        if (orderDetail.Items.length) {
            const order = orderDetail.Items[0];
            let phone = '-';
            let recipientEmail;
            if (order.retailer_id) {
                this.updateProducStock(order, Constant.TABLE_INVENTOTY, 'retailer_id = :primary_id');
                const retailerDetails = await this.getRetailerDetails(order.retailer_id);
                phone = retailerDetails.phone || '-';
                recipientEmail = retailerDetails.email;
            }
            if (order.fulfillment_center_id) {
                this.updateProducStock(order, Constant.TABLE_FC_INVENTORY, 'fulfillment_center_id = :primary_id');
                const fulfillmentCentersDetails = await this.getFulfillmentCentersDetails(order);
                phone = fulfillmentCentersDetails.primary_contact_number || '-';
                recipientEmail = fulfillmentCentersDetails.primary_email_address;
                NavigatorService.createCustomerInNavigator(order, fulfillmentCentersDetails);
            }
            this.sendRetailerFCEmail(order, recipientEmail, templateResult);
            this.prepareMailData(order, phone, templateResult);
        }
    }

    /**
     * @desc This function is being used to prepare query
     * @since 04/10/2021
     * @param {Object} body Request body
     * @param {Object} created_at CreatedAt date sort Key
     */
    preprareQuery (body, ele) {
        const createdAt = new Date(ele.created_at);
        return {
            TableName: 'Order',
            Key: {
                brand_id: body.brand_id,
                createdAt: parseInt(createdAt.getTime())
            },
            UpdateExpression: 'SET payment_detail = :payment_detail, payment_status = :payment_status, ' +
                'order_status = :order_status, search_status = :search_status',
            ConditionExpression: 'order_id = :order_id',
            ExpressionAttributeValues: {
                ':order_id': ele.order_id,
                ':payment_detail': ele.payment_detail,
                ':payment_status': Constant.PLACE_ORDER.PAYMENT_STATUS,
                ':order_status': Constant.PLACE_ORDER.ORDER_STATUS,
                ':search_status': (Constant.PLACE_ORDER.ORDER_STATUS).toLowerCase()
            }
        };
    }

    validateRequest (body) {
        if (!body.brand_id) {
            throw Message.ORDER.BRAND_ID_REQUIRED;
        } else if (!Array.isArray(body.order) || !body.order.length) {
            throw Message.ORDER.INVALID_REQUEST;
        } else {
            var isValid = true;
            body.order.forEach((ele) => {
                if (!ele.created_at || !ele.order_id) {
                    isValid = false;
                }
            });
            if (!isValid) {
                throw Message.ORDER.INVALID_REQUEST;
            } else {
                return;
            }
        }
    }

    /**
     * @desc This function is being used to place order
     * @author Innovify
     * @since 23/12/2020
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {Object} orderData Order Data
     * @param {String} phone phone
     */
    prepareMailData (order, phone, templateResult) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const orderData = JSON.parse(JSON.stringify(order));
        orderData.logo = templateResult.Items[0].logo;
        orderData.status = 'Processing';
        orderData.product_detail.forEach((element, index) => {
            orderData.product_detail[index].product_img = element.product_img || Constant.PRODUCT_DEFAULT_IMG;
            orderData.product_detail[index].product_total
             = formatter.format(orderData.product_detail[index].price * orderData.product_detail[index].qty);
            orderData.product_detail[index].price = formatter.format(orderData.product_detail[index].price);
        });
        orderData.payment_detail.discount = formatter.format(parseFloat(orderData.payment_detail.discount));
        orderData.payment_detail.shipping_charge = formatter.format(parseFloat(orderData.payment_detail.shipping_charge));
        orderData.payment_detail.sub_total = formatter.format(parseFloat(orderData.payment_detail.sub_total));
        orderData.payment_detail.tax = formatter.format(parseFloat(orderData.payment_detail.tax));
        orderData.payment_detail.total = formatter.format(parseFloat(orderData.payment_detail.total));
        orderData.fulfilled_by = (orderData.retailer) ? orderData.retailer : orderData.fulfillment_center;
        orderData.emailBody = {
            row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, thanks for your order!`,
            row_2: `Our trusted retailer, ${orderData.fulfilled_by}, has received your order and has already begun fulfilling it.
                For delivery questions feel free to reach out to them at ${phone}.`
        };
        orderData.footerData = {
            row_1: 'Thank you for shopping with us!'
        };
        const templateData = orderData;
        const email = {
            to: [templateData.user_email],
            from: Constant.PLACE_ORDER.SOURCE_EMAIL
        };
        const subject = `Order Placed ${templateData.brand_name} #${templateData.order_id}`;
        EmailService.createTemplate('OrderMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    /**
    * @desc This function is being used to get retailer details
    * @param {Object} body boody
    * @param {String} tableName table name
    * @param {String} keyCondition key condition
    */
    async updateProducStock (body, tableName, keyCondition) {
        var productDetail = body.product_detail;
        for (const key in productDetail) {
            if (Object.hasOwnProperty.call(productDetail, key)) {
                const element = productDetail[key];
                const params = {
                    TableName: tableName,
                    KeyConditionExpression: keyCondition,
                    FilterExpression: 'product_id = :product_id AND size = :size',
                    ExpressionAttributeValues: {
                        ':primary_id': (body.retailer_id) ? body.retailer_id : body.fulfillment_center_id,
                        ':product_id': element.product_id,
                        ':size': element.size
                    }
                };
                const result = await docClient.query(params).promise();
                if (result.Count > 0) {
                    const resultData = result.Items[0];
                    const stock = (resultData.stock - element.qty);
                    var inventoryParams = {
                        TableName: tableName,
                        Key: {
                            createdAt: resultData.createdAt
                        },
                        UpdateExpression: 'SET stock = :stock, search_stock = :search_stock',
                        ExpressionAttributeValues: {
                            ':stock': stock,
                            ':search_stock': stock.toString()
                        }
                    };
                    if (resultData.retailer_id) {
                        inventoryParams.Key.retailer_id = resultData.retailer_id;
                    } else {
                        inventoryParams.Key.fulfillment_center_id = resultData.fulfillment_center_id;
                    }
                    await docClient.update(inventoryParams).promise();
                }
            }
        }
    }

    /**
    * @desc This function is being used to get retailer details
    * @param {String} retailerId retailerId
    */
    async getRetailerDetails (retailerId) {
        var params = {
            TableName: 'Portal_users',
            IndexName: 'user_id-index',
            KeyConditionExpression: 'user_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': retailerId
            },
            ProjectionExpression: 'user_id, phone, email'
        };
        const retailerData = await docClient.query(params).promise();
        if (retailerData.Items.length) {
            return retailerData.Items[0];
        }
        return [];
    }

    /**
    * @desc This function is being used to get fullfillment Centers details
    * @param {Object} orders orders
    */
    async getFulfillmentCentersDetails (orders) {
        var params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id AND fulfillment_center_id = :fulfillment_center_id',
            ExpressionAttributeValues: {
                ':brand_id': orders.brand_id,
                ':fulfillment_center_id': orders.fulfillment_center_id
            },
            ProjectionExpression: 'fulfillment_center_id, primary_contact_number, fulfillment_center_name, primary_email_address'
        };
        const result = await docClient.query(params).promise();
        if (result.Items.length) {
            return result.Items[0];
        }
        return {};
    }

    /**
     * @desc This function is being used to send place order email to retailer
     * @author Growexx
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {Object} order Order Data
     * @param {String} retailerEmail retailerEmail
     */
    sendRetailerFCEmail (order, retailerEmail, templateResult) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        });
        const orderData = JSON.parse(JSON.stringify(order));
        orderData.logo = templateResult.Items[0].logo;
        orderData.status = 'Processing';
        orderData.product_detail.forEach((element, index) => {
            orderData.product_detail[index].product_img = element.product_img || Constant.PRODUCT_DEFAULT_IMG;
            orderData.product_detail[index].product_total
             = formatter.format(orderData.product_detail[index].price * orderData.product_detail[index].qty);
            orderData.product_detail[index].price = formatter.format(orderData.product_detail[index].price);
        });
        orderData.payment_detail.discount = formatter.format(parseFloat(orderData.payment_detail.discount));
        orderData.payment_detail.shipping_charge = formatter.format(parseFloat(orderData.payment_detail.shipping_charge));
        orderData.payment_detail.sub_total = formatter.format(parseFloat(orderData.payment_detail.sub_total));
        orderData.payment_detail.tax = formatter.format(parseFloat(orderData.payment_detail.tax));
        orderData.payment_detail.total = formatter.format(parseFloat(orderData.payment_detail.total));
        orderData.fulfilled_by = (orderData.retailer) ? orderData.retailer : orderData.fulfillment_center;
        orderData.emailBody = {
            row_1: 'A new order has been placed for you to fulfill. ' +
            `Please access the portal ${orderData.domain_name} and proceed with the order`
        };
        const templateData = orderData;
        const email = {
            to: [retailerEmail],
            from: Constant.PLACE_ORDER.SOURCE_EMAIL
        };
        const subject = `New Order #${templateData.order_id} has been placed`;
        EmailService.createTemplate('FulfillPartnerOrderMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }
}
module.exports.ConfirmOrderHandler = async (event, context, callback) => new ConfirmOrder().confirmOrder(event, context, callback);
