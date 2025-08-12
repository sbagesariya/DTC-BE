const Constant = require('../../utils/constants');
const Logger = require('../../utils/logger');
const ParameterStore = require('./../../utils/ssm');
const superagent = require('superagent');
const EmailService = require('./../../utils/email/email-service');
const TemplateHTML = require('./../../utils/email/so-placed-in-navigator-template');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name NavigatorService Navigator service functions
*/
class NavigatorService {

    /**
     * @desc This function is being used to get navigator public group token key from AWS KMS
     */
    static async getNavigatorKeyToken () {
        return await ParameterStore.getValue(Constant.PARKSTREET_NAVIGATOR.LNJ_GROUP_TOKEN);
    }

    /**
     * @desc This function is being used to check and create customer in navigator using navigator API
     * @param {String} keyId Navigator public group API token
     * @param {String} endPoint API end point
     * @param {body} body Request body
     */
    static callNavigatorAPI (keyId, endPoint, body) {
        return new Promise((resolve, reject) => {
            superagent
                .post(process.env.NAV_PUBLIC_API_URL + endPoint)
                .send(body)
                .query({ token: keyId })
                .end((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.body);
                    }
                });
        });
    }

    /**
     * @desc This function is being used to check and create requested custome in navigator
     * @param {Object} body Request body
     * @param {Array} orderData Orders data
     * @param {Object} getPoNo Auto increment po number data
     */
    static async createCustomerInNavigator (data, fulfillmentCentersDetails) {
        const order = JSON.parse(JSON.stringify(data));
        const keyId = await this.getNavigatorKeyToken();
        let reqBody = { customer_email: order.user_email, customer_type: Constant.PARKSTREET_NAVIGATOR.CUSTOMER_TYPE };
        this.callNavigatorAPI(keyId, '/public_apis/get_customers', reqBody).then((result) => {
            if (result.hasError === false && !result.data) {
                reqBody = this.prepareCreateCustomerInNav(order);
                this.callNavigatorAPI(keyId, '/public_apis/create_customer', reqBody).then((result) => {
                    if (result.hasError) {
                        Logger.info('createCustomerInNavigator: Add', order.user_detail);
                    } else {
                        this.createSoInNavigator(order, keyId, result.customer_id, fulfillmentCentersDetails);
                    }
                }).catch((err) => {
                    Logger.error('createCustomerInNavigator:Add', err);
                });
            } else {
                this.createSoInNavigator(order, keyId, result.data[0].customer_id, fulfillmentCentersDetails);
            }
        }).catch((err) => {
            Logger.error('createCustomerInNavigator:get', err);
        });
    }

    /**
     * @desc This function is being used to prepare create customer request for navigator api
     * @param {Object} order Request body
     */
    static prepareCreateCustomerInNav (order) {
        return {
            'cust_name': `${order.user_detail.first_name} ${order.user_detail.last_name}`,
            'cust_email': order.user_email,
            'customer_type': Constant.PARKSTREET_NAVIGATOR.CUSTOMER_TYPE,
            'cust_phone': order.user_detail.phone,
            'delivery_add_1': order.delivery_address.address_line_1,
            'delivery_add_2': order.delivery_address.address_line_2 || '',
            'delivery_zip': order.delivery_address.zip_code,
            'delivery_city': order.delivery_address.city,
            'delivery_state': order.delivery_address.state,
            'delivery_country': order.delivery_address.country,
            'billing_add_1': order.billing_address.address_line_1,
            'billing_add_2': order.billing_address.address_line_2 || '',
            'billing_zip': order.billing_address.zip_code,
            'billing_city': order.billing_address.city,
            'billing_state': order.billing_address.state,
            'billing_country': order.billing_address.country,
            'payment_terms': Constant.PARKSTREET_NAVIGATOR.DEFAULT_PAYMENT_TERM
        };
    }


    /**
     * @desc This function is being used to create SO in navigator via navigator API
     * @param {Object} body Request body
     * @param {Array} orderData Orders data
     * @param {Number} poNumber Auto increment po number data
     * @param {String} keyId Auto increment po number data
     * @param {String} customerId Auto increment po number data
     */
    static createSoInNavigator (sOrder, keyId, customerId, fulfillmentCentersDetails) {
        if (fulfillmentCentersDetails.fulfillment_center_name.toLowerCase() === Constant.FULFILLMENT_CENTER_NAME.toLowerCase()) {
            const sOrderData = this.prepareSO(sOrder, customerId);
            this.callNavigatorAPI(keyId, '/public_apis/create_sales_order', sOrderData).then((result) => {
                this.sendMailToNavigator(sOrder, result);
                if (result.hasError) {
                    this.saveErrorLog(sOrder, result);
                } else {
                    this.updateSalesOrderId(sOrder, result);
                }
                Logger.info('createSoInNavigator: create so', result);
            }).catch((err) => {
                Logger.error('createSoInNavigator:catch', err);
            });
        }
    }

    /**
     * @desc This function is being used to prepare request data for create SO in navigator
     * @param {Object} sOrder Fulfillment center SO order object
     * @param {Number} poNumber Auto increment po number data
     * @param {String} customerId Auto increment po number
     */
    static prepareSO (sOrder, customerId) {
        const products = sOrder.product_detail.map((ele) => {
            return {
                product_id: ele.sku_code,
                price: ele.price,
                quantity: ele.qty
            };
        });
        if (sOrder.payment_detail.tax) {
            products.push({
                product_id: Constant.NON_INVENTORY_ITEMS.SALES_TAX_ITEM,
                price: sOrder.payment_detail.tax,
                quantity: Constant.NON_INVENTORY_ITEMS.DEFAULT_QUANTITY
            });
        }
        if (sOrder.payment_detail.shipping_charge) {
            products.push({
                product_id: Constant.NON_INVENTORY_ITEMS.SHIPPING_COST_ITEM,
                price: sOrder.payment_detail.shipping_charge,
                quantity: Constant.NON_INVENTORY_ITEMS.DEFAULT_QUANTITY
            });
        }
        return {
            'po_number': sOrder.po_number,
            'customer_id': customerId,
            'customer_shipping_address_street1': sOrder.delivery_address.address_line_1,
            'customer_shipping_address_street2': sOrder.delivery_address.address_line_2 || '',
            'customer_shipping_address_city': sOrder.delivery_address.city,
            'customer_shipping_address_state': sOrder.delivery_address.state,
            'customer_shipping_address_zipcode': sOrder.delivery_address.zip_code,
            'customer_shipping_address_country': sOrder.delivery_address.country,
            'customer_billing_address_street1': sOrder.billing_address.address_line_1,
            'customer_billing_address_street2': sOrder.billing_address.address_line_2 || '',
            'customer_billing_address_city': sOrder.billing_address.city,
            'customer_billing_address_state': sOrder.billing_address.state,
            'customer_billing_address_zipcode': sOrder.billing_address.zip_code,
            'customer_billing_address_country': sOrder.billing_address.country,
            'payment_term': Constant.PARKSTREET_NAVIGATOR.DEFAULT_PAYMENT_TERM,
            'warehouse': process.env.WAREHOUSE,
            'location_group': process.env.LOCATION_GROUP,
            'location': Constant.PARKSTREET_NAVIGATOR.LOCATION,
            'currency_code': Constant.PARKSTREET_NAVIGATOR.CURRENCY_CODE,
            'requested_delivery_date': new Date(sOrder.requested_delivery_date),
            'estimated_delivery_date': new Date(sOrder.estimated_delivery_date),
            'order_type_id': Constant.PARKSTREET_NAVIGATOR.ORDER_TYPE_ID,
            'approval_status': Constant.PARKSTREET_NAVIGATOR.SO_STATUS,
            'order_date': new Date(sOrder.createdAt),
            'delivery_types': Constant.PARKSTREET_NAVIGATOR.DELIVERY_TYPE,
            'is_sample': Constant.PARKSTREET_NAVIGATOR.IS_SAMPLE,
            'invoice_with_shipment': Constant.PARKSTREET_NAVIGATOR.INVOICE_WITH_SHIPMENT,
            'shipment_crosses_border': Constant.PARKSTREET_NAVIGATOR.SHIPMENT_CROSSES_BORDER,
            'products': products
        };
    }

    /**
     * @desc This function is being used to automated email to inform that a DTC order is being created in Navigator
     * @param {Object} sOrder Fulfillment center SO order object
     * @param {Object} SOresult SO API response
     */
    static sendMailToNavigator (sOrder, SOresult) {
        const email = {
            to: [Constant.PARKSTREET_NAVIGATOR.RECIPIENT_MAIL_TO],
            from: Constant.PLACE_ORDER.SOURCE_EMAIL
        };
        let subject;
        const templateData = {
            sOrderId: SOresult.sales_order_id,
            uniqueId: SOresult.id,
            poNumber: sOrder.po_number,
            estimatedDeliveryDate: sOrder.search_estimated_delivery_date
        };
        const text = `${sOrder.user_detail.first_name} ${sOrder.user_detail.last_name} placed an order for 
            ${sOrder.brand_name} and has sent the below SO from the SO public API`;
        if (SOresult.hasError) {
            if (SOresult.products) {
                templateData.errorTitle = 'Product_id not found';
                templateData.errors = SOresult.products;
                templateData.bodyDescription = `${text}, and no product_id has been found.`;
                subject = `No product_id for DTC ${sOrder.brand_name} - PO#: ${sOrder.po_number} Failed`;
            } else {
                templateData.errorTitle = 'Error reponse';
                templateData.errors = SOresult.details;
                templateData.bodyDescription = `${text}, and an error has been found.`;
                subject = `DTC ${sOrder.brand_name} - PO#: ${sOrder.po_number} Failed`;
            }
            templateData.brandName = sOrder.brand_name;
        } else {
            templateData.received = 'Successfully';
            templateData.bodyDescription = `${text}.`;
            subject = `DTC ${sOrder.brand_name} - SO#: ${SOresult.sales_order_id} Sent`;
        }
        EmailService.createTemplate('SOCreatedInNavigagor', subject, email, TemplateHTML, JSON.stringify(templateData));
    }

    /**
     * @desc This function is used to add so order error log
     * @since 13/12/2021
     * @param {Object} orderData orderData
     * @param {Object} resultData resultData
     */
    static async saveErrorLog (orderData, resultData) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: orderData.brand_id,
                createdAt: orderData.createdAt
            },
            ConditionExpression: 'order_id = :order_id',
            UpdateExpression: 'SET nav_error_msg = :nav_error_msg, nav_error_code = :nav_error_code',
            ExpressionAttributeValues: {
                ':order_id': orderData.order_id,
                ':nav_error_msg': {
                    msg: resultData.msg,
                    products: resultData.products,
                    details: resultData.details
                },
                ':nav_error_code': resultData.errCode
            }
        };
        await docClient.update(params).promise();
    }

    /**
     * @desc This function is used to update sales_order_id in DTC
     * @since 29/03/2022
     * @param {Object} orderData orderData
     * @param {Object} resultData resultData
     */
    static async updateSalesOrderId (orderData, resultData) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: orderData.brand_id,
                createdAt: orderData.createdAt
            },
            ConditionExpression: 'order_id = :order_id',
            UpdateExpression: 'SET sales_order_id = :sales_order_id',
            ExpressionAttributeValues: {
                ':order_id': orderData.order_id,
                ':sales_order_id': resultData.sales_order_id
            }
        };
        await docClient.update(params).promise();
    }
}

module.exports = NavigatorService;
