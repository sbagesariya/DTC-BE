const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AlcoholTypesByBrand class
 */
class AlcoholTypesByBrand {

    /**
     * @desc This function is being used to to get Alcohol Types by brand id
     * @param {Object} req Request
     * @param {Object} req.pathParameters PathParameters
     * @param {String} req.pathParameters.brand_id Brand Id
     */
    async getAlcoholTypes (req) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async () => {
            try {
                var params = {
                    TableName: 'Products',
                    KeyConditionExpression: '#brand = :brand_id',
                    ExpressionAttributeNames: {
                        '#brand': 'brand_id'
                    },
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    },
                    ProjectionExpression: 'alcohol_type'

                };
                const data = await docClient.query(params).promise();
                const alcoholData = data.Items;
                const unique = [...new Set(alcoholData.map(item => item.alcohol_type))];
                const response = { 'types': unique, 'count': unique.length };
                return Utils.successResponse(response);
            } catch (error) {
                Logger.error('getAlcoholType:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getAlcoholType:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate request
     * @param {Object} body RequestBody
     */
    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.PRODUCT.BRAND_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }
}
module.exports.alcoholTypesByBrandHandler = async (event, context, callback) => new
AlcoholTypesByBrand().getAlcoholTypes(event, context, callback);
