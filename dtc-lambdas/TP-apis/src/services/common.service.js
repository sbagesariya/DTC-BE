const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const moment = require('moment');
const Message = require('./../../utils/message');
const Logger = require('./../../utils/logger');
const Constant = require('./../../utils/constants');
const EmailService = require('./../../utils/email/email-service');
const TemplateHTML = require('../../utils/email/order-mail-template');

/**
 * @name CommonService Common service functions
*/
class CommonService {
    /**
    * @desc This unction is being used to get brand details
    * @param {String} BrandId Brand Id
    * @param {String} projection Domain
    */
    static async getPublicApiToken (brandId, projection) {
        var params = {
            TableName: 'Public_api_tokens',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'active = :active',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':active': 1
            },
            ProjectionExpression: projection
        };
        const data = await docClient.query(params).promise();
        const item = data.Items;
        return item.length ? item[0] : null;
    }

    static async checkCustomer (body, projection) {
        var params = {
            TableName: 'Users',
            IndexName: 'customer_id-index',
            KeyConditionExpression: 'customer_id = :customerId',
            ExpressionAttributeValues: {
                ':customerId': body.customer_id
            },
            ProjectionExpression: projection
        };
        return await docClient.query(params).promise();
    }

    static async getSalesOrder (body, projection) {
        var params = {
            TableName: 'Order',
            IndexName: 'order_id-index',
            KeyConditionExpression: 'order_id = :order_id',
            ExpressionAttributeValues: {
                ':order_id': body.order_id
            }
        };
        if (projection) {
            params.ProjectionExpression = projection;
        }
        return await docClient.query(params).promise();
    }

    static dateFormat (date, defaultFormat = 'YYYY/MM/DD') {
        return moment(date).format(defaultFormat);
    }

    /**
    * @desc This function is being used to brand details
    * @param {String} brandId Brand Id
    */
    static async getBrandDetails (brandId, projection) {
        const params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            }
        };
        if (projection) {
            params.ProjectionExpression = projection;
        }
        const data = await docClient.query(params).promise();
        return data.Items.length ? data.Items[0] : {};
    }

    static orderNumber () {
        const now = Date.now().toString();
        const second = Math.random().toString(16).substr(2, 14).toUpperCase();
        const first = `${now}${Math.floor(Math.random() * 10)}`;
        return [first.slice(7, 13), second.slice(2, 7)].join('-');
    }

    /**
     * Function to generate customer id
     * @param {String} firstName First Name
     */
    static customerId (firstName) {
        const name = (firstName.substring(0, 3)).toUpperCase();
        const uniqueNumber = `${Math.random().toString(16).substr(2, 14).toUpperCase()}`;
        return ['DTC', name, uniqueNumber.slice(2, 8)].join('-');
    }

    /**
    * @desc This unction is being used to get brand details
    * @param {String} tableName Brand Id
    * @param {String} keyCondition Brand Id
    * @param {String} keyName Brand Id
    * @param {String} projection projection
    */
    static async getDetails (tableName, keyCondition, keyName, projection) {
        var params = {
            TableName: tableName,
            KeyConditionExpression: `${keyName} = :${keyName}`,
            ExpressionAttributeValues: {}
        };
        params.ExpressionAttributeValues[`:${keyName}`] = keyCondition;
        if (projection) {
            params.ProjectionExpression = projection;
        }
        const data = await docClient.query(params).promise();
        if (!data.Items.length) {
            throw `${Message.ORDER_NOT_FOUND} in ${tableName}`;
        } else {
            return data.Items[0];
        }
    }

    /**
     * @desc This function is being used to update auto increment number
     * @param {body} item item
     */
    static updateAutoIncrementNumber (item) {
        const params = {
            TableName: 'Auto_increment',
            Item: item
        };
        docClient.put(params, (err)=> {
            if (err) {
                Logger.error(err);
            }
        });
    }

    /**
     * @desc This function is being used to notify the customer when order is failed
     * @author GrowExx
     * @since 04/02/2022
     * @param {Object} data Order details
     */
    static async notifyCustomer (orderData, status) {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: Constant.CURRENCY,
            minimumFractionDigits: 2
        });
        const templateResult = await this.getBrandActiveTemplate(orderData.brand_id);
        orderData.logo = templateResult.Items[0].logo;
        orderData.fulfilledBy = orderData.fulfillment_center;
        orderData.status = orderData.order_status;
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
        if (status === Constant.ORDER_CANCELLED) {
            const reorderUrl = `${process.env.FE_DOMAIN_URL}/checkout/${orderData.brand_id}/${orderData.order_id}`;
            orderData.emailBody = {
                row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, ` +
                    'your order cannot be fulfilled at this time.',
                row_2: 'Payment has NOT been processed.',
                row_3: 'If you want to reorder with a new retailer please proceed to ' +
                    `<a href="${reorderUrl}">Click Here</a>. Please be aware changes in prices may occur.`
            };
        } else {
            orderData.emailBody = {
                row_1: `Hello ${orderData.user_detail.first_name} ${orderData.user_detail.last_name}, ` +
                    'your order cannot be fulfilled at this time. The order you placed did not meet' +
                    ' the compliance requirements of your market.',
                row_2: 'Your refund has been issued. It may take up to 10 business days for the refund to ' +
                    'be reflected in your bank account.',
                row_3: 'Please return to our catalog at a later time to place this order ' +
                    'again or visit a local retail store to purchase your product.'
            };
        }
        orderData.trackingDetail = {
            trackingNo: '#67579-H897',
            line_1: 'ETA: 4 – 7 Business Days'
        };
        const templateData = orderData;
        const email = {
            to: [templateData.user_email],
            from: Constant.FROM_EMAIL
        };
        const subject = `Your Order #${orderData.order_id} can’t be fulfilled at this time.`;
        EmailService.createTemplate('OrderMailTemplate', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    /**
    * @desc This function is being used to get fullfillment Centers details
    * @param {Object} orders orders
    */
    static async getFulfillmentCentersDetails (body) {
        var params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id
            },
            ProjectionExpression: 'fulfillment_center_id, fulfillment_center_name'
        };
        const result = await docClient.query(params).promise();
        if (result.Items.length) {
            return result.Items;
        }
        return [];
    }

    /**
     * @desc This function is being used to create fulfillment center
     * @author GrowExx
     * @since 07/02/2022
     * @param {Object} body Request
     */
    static async createFulfillmentCenter (order) {
        if (order) {
            const itemData = Constant.PARKSTREET_FULFILLMENT_CENTER;
            itemData.brand_id = order.brand_id;
            var params = {
                TableName: 'Fulfillment_centers',
                Item: itemData
            };
            docClient.put(params, (err) => {
                if (err) {
                    Logger.error('createFulfillmentCenter:catch', err);
                }
            });
        }
    }

    /**
    * @desc This function is being used to get fulfillment inventory product details details
    * @since 30/12/2021
    * @param {Object} body Request body object
    * @param {String} body.product_id Product Id
    */
    static async getInventoryByPoNumber (tableName, ele, projection) {
        var params = {
            TableName: tableName,
            IndexName: 'sku_code-index',
            KeyConditionExpression: '#sku_code = :sku_code',
            ExpressionAttributeNames: {
                '#sku_code': 'sku_code'
            },
            ExpressionAttributeValues: {
                ':sku_code': ele.product_id
            }
        };
        if (projection) {
            params.ProjectionExpression = projection;
        }
        return await docClient.query(params).promise();
    }

    static async getBrandActiveTemplate (brandId) {
        const params = {
            TableName: 'Templates',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':active': true
            },
            FilterExpression: 'active = :active'
        };
        return await docClient.query(params).promise();
    }
}

module.exports = CommonService;
