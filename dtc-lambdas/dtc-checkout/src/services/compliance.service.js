const superagent = require('superagent');
const constants = require('../../utils/constants');
const ParameterStore = require('../../utils/ssm');
const UUID = require('uuid');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Logger = require('./../../utils/logger');

/**
 * @name ComplianceService Compliance service functions
*/
class ComplianceService {

    /**
     * @desc This function is being used to get token
     */
    static async getKeyToken () {
        var sovoscred = await ParameterStore.getValue('sovoscred');
        sovoscred = sovoscred.split(',');
        return Buffer.from(`${sovoscred[0]}:${sovoscred[1]}`, 'utf8').toString('base64');
    }

    /**
     * @desc This unction is being used to validate complaint order request and get sales tax
     * @param {Object} order Order object
     */
    static async validateComplaince (order) {
        const body = this.prepareComplainceRequest(order);
        const token = await this.getKeyToken();
        let statusCode;
        try {
            const result = await this.callRestAPI(token, constants.COMPLIANCE.ORDER_VALIDATE_API, body);
            statusCode = result.statusCode;
            this.saveShipCompliantLog(order, result);
        } catch (error) {
            this.saveShipCompliantLog(order, error.response);
            statusCode = error.response.statusCode;
            Logger.error('dtc-validateComplaince:catch', error);
        }
        return { 'status_code': statusCode };
    }

    /**
     * @desc This function is being used to call rest API
     * @param {String} token API token
     * @param {String} endPoint API end point
     * @param {body} body Request body
     */
    static async callRestAPI (token, endPoint, body) {
        return await superagent
            .post(process.env.SHIP_COMPLAINCE_API_URL + endPoint)
            .set('Authorization', `Basic ${token}`)
            .send(body);
    }

    static prepareComplainceRequest (order) {
        const now = new Date();
        const estDeliveryDate = this.addDays(now, constants.STANDARD_EST_DEL_DATE);
        return {
            'SalesOrder': {
                'BillTo': {
                    'DateOfBirth': order.user_detail.date_of_birth,
                    'Email': order.user_email,
                    'City': order.billing_address.city,
                    'Country': order.billing_address.country,
                    'FirstName': order.billing_address.first_name,
                    'LastName': order.billing_address.last_name,
                    'State': order.billing_address.state,
                    'Street1': order.billing_address.address_line_1,
                    'Zip1': order.billing_address.zip_code
                },
                // Internal value that would be utilized on the ecomm platform
                'CustomerKey': constants.COMPLIANCE.CUSTOMER_KEY,
                // Discounts are for internal tracking, this will not actually change the price
                'Discounts': [
                    {
                        'Amount': order.payment_detail.discount,
                        'Code': order.payment_detail.promo_code
                    }
                ],
                // club, fax, InPerson, Internet, Mail, Phone
                'OrderType': constants.COMPLIANCE.ORDER_TYPE,
                // Payment capture information can go hear, will most likely only populate on the commit
                'Payments': [
                    {
                        'Amount': order.payment_detail.total
                    }
                ],
                'PurchaseDate': now,
                'SalesOrderKey': constants.COMPLIANCE.SALES_ORDER_KEY,
                'SalesTaxCollected': order.payment_detail.tax,
                'Shipments': [
                    {
                        'Discounts': [
                            {
                                'Amount': order.payment_detail.discount,
                                'Code': order.payment_detail.promo_code
                            }
                        ],
                        // Pickup or SupplierToConsumer
                        'LicenseRelationship': constants.COMPLIANCE.SUPPLIER_TO_CONSUMER,
                        'ShipDate': estDeliveryDate,
                        'ShipmentItems': this.getShipmentItems(order),
                        // During a quote this is the recommended value
                        'ShipmentStatus': constants.COMPLIANCE.SENT_TO_FULFILLMENT,
                        // inquire about the possible shipping service codes we support
                        'ShippingService': constants.COMPLIANCE.SHIPPING_SERVICE,
                        'ShipTo': {
                            'DateOfBirth': order.user_detail.date_of_birth,
                            'City': order.delivery_address.city,
                            'Country': order.delivery_address.country,
                            'Email': order.user_email,
                            'FirstName': order.delivery_address.first_name,
                            'LastName': order.delivery_address.last_name,
                            'State': order.delivery_address.state,
                            'Street1': order.delivery_address.address_line_1,
                            'Zip1': order.delivery_address.zip_code
                        }
                    }
                ]
            },
            'AddressOption': {
                'IgnoreStreetLevelErrors': true,
                'RejectIfAddressSuggested': true
            }
        };
    }

    static getShipmentItems (order) {
        const productsItems = [];
        order.product_detail.forEach(ele => {
            productsItems.push({
                'BrandKey': order.brand_name,
                'ProductKey': ele.sku_code,
                'ProductQuantity': ele.qty,
                'ProductUnitPrice': ele.price
            });
        });
        return productsItems;
    }

    /**
     * function to add days to date
     *
     * @param {*} date
     * @param {*} days
     */
    static addDays (date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * @desc This function is used to save ship compliant order log
     * @since 31/01/2022
     * @param {Object} requestData requestData
     * @param {Object} resultData resultData
     */
    static async saveShipCompliantLog (requestData, resultData) {
        let status;
        let message;
        if (resultData) {
            if (resultData.statusCode === constants.COMPLIANCE.SUCCESS_STATUS_CODE) {
                status = resultData.statusCode;
                message = constants.COMPLIANCE.SUCCESS;
            } else {
                status = resultData.status;
                message = constants.COMPLIANCE.FAIL_ERROR_MESSAGE;
            }
            var params = {
                TableName: 'ship_compliant_order_log',
                Item: {
                    log_id: UUID.v4(),
                    brand_id: requestData.brand_id,
                    products: requestData.product_detail,
                    shipping: requestData.payment_detail.shipping_charge,
                    tax: requestData.payment_detail.tax,
                    sub_total: requestData.payment_detail.sub_total,
                    total: requestData.payment_detail.total,
                    customer_email: requestData.user_email,
                    api_response_code: status,
                    api_message: message,
                    api_request: requestData,
                    api_response: (resultData.text) ? JSON.parse(resultData.text) : '',
                    status: (status === constants.COMPLIANCE.SUCCESS_STATUS_CODE) ?
                        constants.COMPLIANCE.SUCCESS : constants.COMPLIANCE.FAIL,
                    created_from: constants.COMPLIANCE.DTC,
                    createdAt: new Date().getTime(),
                    updatedAt: new Date().getTime()
                }
            };
            await docClient.put(params).promise();
        }
    }
}

module.exports = ComplianceService;
