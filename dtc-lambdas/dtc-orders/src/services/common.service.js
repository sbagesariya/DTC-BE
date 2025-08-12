const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const ParameterStore = require('../../utils/ssm');
const Logger = require('../../utils/logger');
const Constant = require('./../../utils/constants');
/**
 * @name CommonService Common service functions
*/
class CommonService {

    /**
    * @desc This function is being used to get brand details
    * @param {String} BrandId Brand Id
    * @param {String} projection Domain
    */
    static async getBrandDetails (brandId, projection) {
        var params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            ProjectionExpression: projection
        };
        const data = await docClient.query(params).promise();
        const item = data.Items;
        return item.length ? item[0] : '';
    }


    /**
    * @desc This function is being used to get stripe object
    */
    static async getStripeObject () {
        const stripeKey = await ParameterStore.getValue('stripe_test_key');
        return require('stripe')(stripeKey);
    }

    /**
    * @desc This function is being used to get retailer details
    * @param {String} retailerId retailerId
    */
    static async getRetailerDetails (retailerId, projection) {
        var params = {
            TableName: 'Portal_users',
            IndexName: 'user_id-index',
            KeyConditionExpression: 'user_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': retailerId
            },
            ProjectionExpression: projection
        };
        const retailerData = await docClient.query(params).promise();
        if (retailerData.Items.length) {
            return retailerData.Items;
        }
        return [];
    }

    /**
     * @desc This function is being used to capture order payment
     * @since 25/10/2022
     * @param {Object} orderData Order details
     */
    static async transferRetailePayment (order, stripeConnectAccount) {
        const stripe = await this.getStripeObject();
        return await stripe.transfers.create({
            amount: parseInt(Number(order.payment_detail.total) * 100),
            currency: 'usd',
            destination: stripeConnectAccount,
            transfer_group: order.payment_id
        });
    }

    /**
     * @desc This function is being used to update order details
     * @since 25/10/2022
     * @param {Object} body Request body
     * @param {Object} refund Payment intent id
     */
    static updateRefundStatus (body, refund) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: body.brand_id,
                createdAt: body.createdAt
            },
            UpdateExpression: 'SET payment_status = :payment_status, refund_info = :refund_info',
            ConditionExpression: 'order_id = :order_id',
            ExpressionAttributeValues: {
                ':payment_status': Constant.REFUND,
                ':refund_info': refund,
                ':order_id': body.order_id
            }
        };
        docClient.update(params, (err) => {
            if (err) Logger.error('updateRefundStatus:err', err);
        });
    }

    /**
     * @desc This function is being used to refund order payment
     * @since 25/10/2022
     * @param {Object} orderData Order details
     */
    static async getStripeKeyAndRefund (orderData) {
        const stripe = await this.getStripeObject();
        return await stripe.refunds.create({
            amount: parseInt(Number(orderData.payment_detail.total) * 100),
            payment_intent: orderData.payment_detail.stripe_payment_intent_id
        });
    }

    static async refundTransaction (order) {
        const stripe = await this.getStripeObject();
        return await stripe.transfers.createReversal(
            order.payment_confirmation_number,
            { amount: parseInt(Number(order.payment_detail.total) * 100) }
        );
    }

    /**
     * @desc This function is being used to update order status
     * @since 07/02/2022
     * @param {Object} orderData Order details
     */
    static upateOrderStatus (body, data, key) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: body.brand_id,
                createdAt: body.createdAt
            },
            UpdateExpression: 'SET order_status = :order_status, search_status = :search_status',
            ExpressionAttributeValues: {
                ':order_status': body.order_status,
                ':search_status': (body.order_status).toLowerCase()
            }
        };
        if (data) {
            params.UpdateExpression += `, ${key} = :${key}`;
            params.ExpressionAttributeValues[`:${key}`] = data.id;
        }
        docClient.update(params, (err) => {
            if (err) {
                Logger.error('upateOrderStatus:error', err);
            }
        });
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

    /**
     * Function to update order payment status
     * @param {*} body
     * @param {*} status
     */
    static updatePaymentStatus (body, status) {
        var params = {
            TableName: 'Order',
            Key: {
                brand_id: body.brand_id,
                createdAt: body.createdAt
            },
            UpdateExpression: 'SET payment_status = :payment_status',
            ConditionExpression: 'order_id = :order_id',
            ExpressionAttributeValues: {
                ':payment_status': status,
                ':order_id': body.order_id
            }
        };
        docClient.update(params, (err) => {
            if (err) {
                Logger.error('updatePaymentStatus:err', err);
            }
        });
    }
}

module.exports = CommonService;
