const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/constant');

/**
 * @desc This function is being used to to verify promo code
 * @author Innovify
 * @since 18/12/2020
 * @param {Object} req Request
 * @param {Object} req.body RequestBody
 * @param {String} req.body.promo_code Promo Code
 * @param {String} req.body.sub_total Sub Total
*/
class VerifyPromoCode {
    async verifyPromoCode (event) {
        const body = JSON.parse(event.body);
        const datetime = new Date();
        const currentdate = datetime.toISOString().slice(0, 10);
        var params = {
            TableName: 'Promo_code',
            KeyConditionExpression: 'promo_code = :promo_code',
            FilterExpression: 'promo_expiry >= :promo_expiry',
            ExpressionAttributeValues: {
                ':promo_code': body.promo_code,
                ':promo_expiry': currentdate
            },
            ProjectionExpression: 'promo_code, promo_discount'
        };
        const data = await docClient.query(params).promise();
        let result = data.Items;
        if (!result.length) {
            return Utils.errorResponse(Message.PROMOCODE.INVALID_PROMO_CODE);
        } else {
            result = result[0];
            const discountedAmount = (body.sub_total * result.promo_discount) / 100;
            result.discounted_amount = discountedAmount;
            return Utils.successResponse(result, Message.PROMOCODE.SUCCESS_PROMO_CODE);
        }
    }
}

module.exports.verifyPromoCodeHandler = async (event, context, callback) =>
    new VerifyPromoCode().verifyPromoCode(event, context, callback);
