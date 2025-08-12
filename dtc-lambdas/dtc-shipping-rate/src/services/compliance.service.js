const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Logger = require('./../../utils/logger');
const superagent = require('superagent');
const constants = require('../../utils/constants');
const ParameterStore = require('../../utils/ssm');
const UUID = require('uuid');

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
    * @param {Object} body Request Body
    */
    static async calculateSalesTax (body) {
        const token = await this.getKeyToken();
        let salesTax = 0.00;
        try {
            const salesTaxReq = this.prepareSalesTaxRequest(body);
            const result = await this.callRestAPI(token, constants.COMPLIANCE.SALES_TAX_ENDPOINT, salesTaxReq);
            if (result.statusCode === constants.COMPLIANCE.SUCCESS_STATUS_CODE) {
                salesTax = result._body.salesTaxDue;
                this.saveShipCompliantLog(body, result._body);
            }
        } catch (error) {
            this.saveShipCompliantLog(body, error.response);
            Logger.error('calculateSalesTax:catch', error);
        }
        return salesTax;
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

    /**
     * @desc This function is used to prepare Sales Tax API Request
     * @since 27/01/2022
     * @param {Object} reqBody reqBody
     */
    static prepareSalesTaxRequest (reqBody) {
        const productDetails = [];
        if (reqBody.product_detail.length) {
            reqBody.product_detail.forEach(element => {
                productDetails.push({
                    'BrandKey': reqBody.brand_name,
                    'ProductKey': element.sku_code,
                    'ProductQuantity': element.qty,
                    'ProductUnitPrice': element.price
                });
            });
        }
        return {
            'ShipToAddress': {
                'City':  reqBody.delivery_address.city,
                'State': reqBody.delivery_address.state,
                'Street1': reqBody.delivery_address.address_line_1 || '',
                'Street2': reqBody.delivery_address.street || '',
                'Zip1': reqBody.delivery_address.zip_code
            },
            'EffectiveDate': new Date(),
            'TaxSaleType': constants.COMPLIANCE.TAX_SALE_TYPE,
            'ShippingAndHandlingCollected': reqBody.shipping_charge,
            'OrderItems': productDetails
        };
    }

    /**
     * @desc This function is used to save ship compliant order log
     * @since 27/01/2022
     * @param {Object} requestData requestData
     * @param {Object} resultData resultData
     */
    static async saveShipCompliantLog (requestData, resultData) {
        let status;
        let message;
        let total = (parseFloat(requestData.sub_total) + parseFloat(requestData.shipping_charge));
        let res;
        if (resultData.statusCode === constants.COMPLIANCE.SUCCESS_STATUS_CODE) {
            status = resultData.statusCode;
            message = resultData.responseStatus;
            total += parseFloat(resultData.salesTaxDue);
            res = resultData;
        } else {
            status = resultData.status;
            message = constants.COMPLIANCE.FAIL_ERROR_MESSAGE;
            res = (resultData.text) ? JSON.parse(resultData.text) : '';
        }
        var params = {
            TableName: 'ship_compliant_order_log',
            Item: {
                log_id: UUID.v4(),
                brand_id: requestData.brand_id,
                products: requestData.product_detail,
                shipping: requestData.shipping_charge,
                tax: resultData.salesTaxDue || 0,
                sub_total: requestData.sub_total || 0,
                total: total.toString(),
                customer_email: requestData.user_email,
                api_response_code: status,
                api_message: message,
                api_request: requestData,
                api_response: res,
                status: (status === constants.COMPLIANCE.SUCCESS_STATUS_CODE) ? constants.COMPLIANCE.SUCCESS : constants.COMPLIANCE.FAIL,
                created_from: constants.COMPLIANCE.DTC,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
        };
        await docClient.put(params).promise();
    }
}

module.exports = ComplianceService;
