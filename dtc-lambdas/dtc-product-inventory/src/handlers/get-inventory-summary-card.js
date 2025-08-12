const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetInventorySummaryCard {

    /**
    * @desc This function is being used to get inventory summary card
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.retailer_id Retailer Id
    */
    async getInventorySummaryCard (req) {
        if (!req.pathParameters.retailer_id) {
            return Utils.errorResponse(Message.RETAILER_REQUIRED);
        }
        try {
            const retailerId = req.pathParameters.retailer_id;
            const result = await this.prepareCardData(retailerId);
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getInventorySummaryCard:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being prepare card data
    * @param {String} retailerId Retailer Id
    */
    async prepareCardData (retailerId) {
        const params = {
            TableName: 'Inventory',
            KeyConditionExpression: 'retailer_id = :retailer_id',
            ExpressionAttributeValues: {
                ':retailer_id': retailerId
            }
        };
        const inventoryData = await docClient.query(params).promise();
        const items = inventoryData.Items;
        const brands = [];
        const products = [];
        items.forEach((value) => {
            if (brands.indexOf(value.brand_id) < 0) {
                brands.push(value.brand_id);
            }
            const productSize = `${value.product_id}_${value.size}`;
            if (products.indexOf(productSize) < 0) {
                products.push(productSize);
            }
        });
        return [
            {
                title: 'Total Brands',
                value: (brands.length > 0) ? brands.length : null
            },
            {
                title: 'Total Products',
                value: (products.length > 0) ? products.length : null
            }
        ];
    }
}
module.exports.getInventorySummaryCardHandler = async (event) =>
    new GetInventorySummaryCard().getInventorySummaryCard(event);
