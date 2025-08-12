const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const ParameterStore = require('../../utils/ssm');
const Logger = require('../../utils/logger');

/**
 * @name CommonService Common service functions
*/
class CommonService {
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
                ':payment_status': 'Refund',
                ':refund_info': refund,
                ':order_id': body.order_id
            }
        };
        docClient.update(params, (err) => {
            if (err) {
                Logger.error('updateRefundStatus:err', err);
            }
        });
    }

    /**
     * @desc This function is being used to refund order payment
     * @since 25/10/2022
     * @param {Object} orderData Order details
     */
    static async getStripeKeyAndRefund (orderData) {
        const stripeKey = await ParameterStore.getValue('stripe_test_key');
        const stripe = require('stripe')(stripeKey);
        return await stripe.refunds.create({
            payment_intent: orderData.payment_detail.stripe_payment_intent_id
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

}

module.exports = CommonService;
