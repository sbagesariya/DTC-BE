const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const CommonService = require('./../services/common.service');
const ComplianceService = require('./../services/compliance.service');
const NavigatorService = require('./../services/navigator.service');
const Constant = require('./../../utils/constants');

/**
 * @name ThirdPartyCreateSalesOrder class
 */
class ThirdPartyCreateSalesOrder {

    /**
    * @desc This function is being used to create sales order
    * @author GrowExx
    * @since 01/11/2021
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    */
    async createSalesOrder (req, context, callback) {
        const body = JSON.parse(req.body);
        let data = {};
        try {
            this.validateRequest(body);
            const getPoNo = await CommonService.getDetails('Auto_increment', Constant.PARKSTREET_NAVIGATOR.PO_NUMBER_KEY,
                'increment_type');
            getPoNo.increment_number += 1;
            const fulfillmentDetail = await CommonService.getFulfillmentCentersDetails(body);
            data = await this.prepareSalesOrderData(body, getPoNo.increment_number, fulfillmentDetail);
            const params = {
                TableName: 'Order',
                Item: data
            };
            await docClient.put(params).promise();
            const complianceResponse = await ComplianceService.validateComplaince(data);
            let response;
            if (complianceResponse !== Constant.COMPLIANCE.SUCCESS_STATUS_CODE) {
                this.updateOrderStatus(data);
                response = Utils.errorResponse(null, { status_code: complianceResponse });
            } else {
                NavigatorService.createCustomerInNavigator(data, fulfillmentDetail);
                response = Utils.successResponse({ 'sales_order_id': data.order_id });
            }
            CommonService.updateAutoIncrementNumber(getPoNo);
            return callback(null, response);
        } catch (error) {
            Logger.error('createSalesOrder:catch', error);
            if (data.order_id) {
                this.updateOrderStatus(data);
            }
            return callback(null, Utils.errorResponse(error));
        }
    }

    /**
     * @desc This function is being used to validate create sales order request
     * @author GrowExx
     * @since 01/11/2021
     * @param {Object} body RequestBody
     * @param {String} req.body.confirmation_order_number Confirmation Order Number
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.customer_id Customer Id
     * @param {String} req.body.order_date Order Date
     * @param {String} req.body.transaction_type Transaction Type
     * @param {String} req.body.payment_status Payment Status
     * @param {String} req.body.fulfillment_types Fulfillment Types
     * @param {String} req.body.estimated_delivery_date Estimated Delivery Date
     * @param {String} req.body.delivery_add_1 Delivery Add 1
     * @param {String} req.body.delivery_add_2 Delivery Add 2
     * @param {String} req.body.delivery_zip Delivery Zip
     * @param {String} req.body.delivery_city Delivery City
     * @param {String} req.body.delivery_state Delivery State
     * @param {String} req.body.total_shipping_cost Total Shipping Cost
     * @param {String} req.body.total_taxes Total Taxes
     * @param {String} req.body.total_promotion Total Promotion
     * @param {Array} req.body.product_detail Product Detail
     */
    validateRequest (body) {
        const conditionsToCheck = [
            'confirmation_order_number', 'brand_id', 'customer_id', 'order_date', 'transaction_type',
            'payment_status', 'fulfillment_types', 'estimated_delivery_date', 'delivery_add_1', 'delivery_add_2',
            'delivery_zip', 'delivery_city', 'delivery_state', 'total_shipping_cost', 'total_taxes',
            'total_promotion', 'product_detail'
        ];
        const difference = conditionsToCheck.filter(x => !Object.keys(body).includes(x));
        if (difference.length > 0) {
            throw `${Message.REQUIRED_PARAMETERS} ${difference.join(', ')}`;
        } else if (!Array.isArray(body.product_detail) || !body.product_detail.length) {
            throw Message.INVALID_REQUEST_PRODUCT;
        } else {
            return '';
        }
    }

    /**
     * @desc This function is being used to prepare sales order data
     * @author GrowExx
     * @since 01/11/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} poNumber
     */
    async prepareSalesOrderData (body, poNumber, fulfillmentDetail) {
        const brandData = await CommonService.getBrandDetails(body.brand_id, 'brand_name');
        const projection = 'email, first_name, last_name, phone, date_of_birth';
        let userData = await CommonService.checkCustomer(body, projection);
        userData = userData.Items[0];
        const data = {};
        data.brand_id = body.brand_id;
        data.brand_name = brandData.brand_name;
        data.user_email = userData.email;
        data.user_detail = {
            'first_name': userData.first_name,
            'last_name': userData.last_name,
            'phone': userData.phone,
            'date_of_birth': CommonService.dateFormat(userData.date_of_birth, 'MM/DD/YYYY')
        };
        data.instructions = body.delivery_instructions;
        data.gift_note = '';
        data.cardType = '';
        data.accept_terms = true;
        data.newsletter = false;
        data.delivery_address = {
            'first_name': userData.first_name,
            'last_name': userData.last_name,
            'country': body.delivery_country,
            'address_line_1': body.delivery_add_1,
            'street': body.delivery_add_2,
            'city': body.delivery_city,
            'state': body.delivery_state,
            'zip_code': body.delivery_zip
        };
        data.billing_address = {
            'same_as_delivery': true,
            'first_name': userData.first_name,
            'last_name': userData.last_name,
            'address_line_1': body.delivery_add_1,
            'country': body.billing_country,
            'street': body.delivery_add_2,
            'city': body.delivery_city,
            'state': body.delivery_state,
            'zip_code': body.delivery_zip
        };
        let subTotal = 0;
        body.product_detail.forEach(a => subTotal += a.unit_price * a.quantity);
        data.payment_detail = {
            'sub_total': subTotal.toFixed(2).toString(),
            'shipping_charge': body.total_shipping_cost.toFixed(2).toString(),
            'tax': body.total_taxes.toFixed(2).toString(),
            'discount': body.total_promotion.toFixed(2).toString(),
            'promo_code': '',
            'total': (subTotal + body.total_shipping_cost + body.total_taxes - body.total_promotion).toFixed(2).toString(),
            'payment_type': Constant.COMPLIANCE.PAYMENT_TYPE
        };
        data.product_detail = await this.prepareProductDetails(body);
        data.stripe_order_amount = '';
        data.search_placed_on = body.order_date;
        data.search_user_name = `${(data.user_detail.first_name).toLowerCase()} ${(data.user_detail.last_name).toLowerCase()}`;
        data.search_state = (data.delivery_address.state).toLowerCase();
        data.sort_state = data.delivery_address.state;
        data.search_total = parseFloat(data.payment_detail.total);
        data.sort_total = parseFloat(data.payment_detail.total);
        data.createdAt = new Date().getTime();
        data.search_brand_name = (data.brand_name).toLowerCase();
        data.sort_brand_name = (data.brand_name).toLowerCase();
        data.estimated_delivery_date = new Date(body.estimated_delivery_date).getTime();
        data.search_estimated_delivery_date = CommonService.dateFormat(new Date(body.estimated_delivery_date));
        data.search_status = (Constant.PENDING).toLowerCase();
        data.order_status = Constant.PENDING;
        data.user_id = body.customer_id;
        data.transaction_type = body.transaction_type;
        data.payment_status = body.payment_status;
        data.fulfillment_types = body.fulfillment_types;
        data.confirmation_order_number = body.confirmation_order_number;
        data.payment_date = body.payment_date;
        data.order_id = CommonService.orderNumber();
        data.search_order_id = (data.order_id).toLowerCase();
        data.sort_order_id = data.order_id;
        data.created_from = Constant.USER_TYPE;
        data.order_notes = body.order_notes;
        data.tracking_company = body.tracking_company || Constant.TRAKING_COMPANY;
        data.tracking_id = body.tracking_id || '-';
        data.po_number = Constant.PARKSTREET_NAVIGATOR.PO_NUMBER_PREFIX + poNumber;
        if (fulfillmentDetail.length) {
            data.fulfillment_center = fulfillmentDetail[0].fulfillment_center_name;
            data.fulfillment_center_id = fulfillmentDetail[0].fulfillment_center_id;
        } else {
            data.fulfillment_center = Constant.PARKSTREET_FULFILLMENT_CENTER.fulfillment_center_name;
            data.fulfillment_center_id = Constant.PARKSTREET_FULFILLMENT_CENTER.fulfillment_center_id;
            CommonService.createFulfillmentCenter(body);
        }
        data.sales_order_id = '';
        return data;
    }

    /**
     * @desc This function is being used get order data
     * @author GrowExx
     * @since 03/11/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     */
    async prepareProductDetails (body) {
        const productData = [];
        var productDetails = body.product_detail;
        for (const key in productDetails) {
            if (Object.hasOwnProperty.call(productDetails, key)) {
                const item = productDetails[key];
                const productDetail = {};
                const sizeVariants = await this.getProductVariants(item.product_id, item.variant_id);
                productDetail.product_id = item.product_id;
                productDetail.price = item.unit_price;
                productDetail.sku_code = sizeVariants.sku_code || '';
                productDetail.qty = item.quantity;
                productDetail.size = `${sizeVariants.variant_size} ${sizeVariants.variant_type}`;
                productDetail.name = sizeVariants.product_name;
                productDetail.createdAt = sizeVariants.createdAt;
                productData.push(productDetail);
            }
        }
        return productData;
    }

    /**
    * @desc This function is being used to get product variant
    * @param {String} productId Product Id
    * @param {String} variantId Variant Id
    */
    async getProductVariants (productId, variantId) {
        const params = {
            TableName: 'Size_variants',
            KeyConditionExpression: 'product_id = :product_id AND variant_id = :variant_id',
            ExpressionAttributeValues: {
                ':product_id': productId,
                ':variant_id': variantId
            },
            ProjectionExpression: 'variant_size, variant_type, product_name, sku_code, createdAt'
        };
        const variantData = await docClient.query(params).promise();
        return variantData.Items[0];
    }

    /**
     * @desc This function is being used to upadate order status
     * @author GrowExx
     * @since 31/01/2022
     * @param {Object} data Order details
     */
    async updateOrderStatus (data) {
        try {
            var params = {
                TableName: 'Order',
                Key: {
                    brand_id: data.brand_id,
                    createdAt: data.createdAt
                },
                UpdateExpression: 'SET order_status = :order_status, search_status = :search_status',
                ConditionExpression: 'order_id = :order_id',
                ExpressionAttributeValues: {
                    ':order_status': Constant.ORDER_CANCELLED,
                    ':search_status': (Constant.ORDER_CANCELLED).toLowerCase(),
                    ':order_id': data.order_id
                }
            };
            await docClient.update(params).promise();
            data.order_status = Constant.ORDER_CANCELLED;
            CommonService.notifyCustomer(data);
        } catch (error) {
            Logger.error('updateOrderStatus:catch', error);
        }
    }
}
module.exports.ThirdPartyCreateSalesOrderHandler = async (event, context, callback) =>
    new ThirdPartyCreateSalesOrder().createSalesOrder(event, context, callback);
