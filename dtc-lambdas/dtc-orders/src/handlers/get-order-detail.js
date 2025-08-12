const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetOrdersDetail {
    async getOrderDetail (req) {
        if (!req.pathParameters.order_id) {
            return Utils.errorResponse(undefined, Message.ORDER_ID_REQUIRED);
        }
        try {
            var params = {
                TableName: 'Order',
                IndexName: 'order_id-index',
                KeyConditionExpression: 'order_id = :order_id',
                ExpressionAttributeValues: {
                    ':order_id': req.pathParameters.order_id
                },
                ProjectionExpression: 'order_id, user_email, user_detail, delivery_address, billing_address,' +
                    'brand_id, brand_name, product_detail, order_status, instructions, gift_note, newsletter, estimated_delivery_date,' +
                    'retailer, retailer_id, payment_status, refund_info, createdAt, updatedAt'
            };
            if (req.resource.indexOf('cms/') !== -1) {
                params.ProjectionExpression = params.ProjectionExpression + ',payment_detail';
            }
            const data = await docClient.query(params).promise();
            const item = data.Items;

            if (item.length) {
                const brandData = await this.getBrandDetail(item[0].brand_id);
                const brandEmail = await this.getBrandEmail(item[0].brand_id);
                item[0].brand_logo = brandData[0].brand_logo;
                item[0].brand_website = brandData[0].brand_website;
                item[0].brand_email = brandEmail[0].email;
            }
            return Utils.successResponse(item, 'Success!');
        } catch (error) {
            Logger.error('getOrderDetail:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to get Brand details like logo, website
     *
     * @param {*} brandId
     */
    async getBrandDetail (brandId) {
        var params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            }
        };

        const data = await docClient.query(params).promise();
        return data.Items;
    }

    async getBrandEmail (brandId) {
        var params = {
            TableName: 'Portal_users',
            FilterExpression: 'user_id = :user_id',
            ExpressionAttributeValues: {
                ':user_id': brandId
            },
            ProjectionExpression: 'email'

        };

        const data = await docClient.scan(params).promise();
        return data.Items;
    }
}

module.exports.getOrderDetailHandler = async (event, context, callback) =>
    new GetOrdersDetail().getOrderDetail(event, context, callback);
