const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class BrandsTemplateLibrary {
    /**
   * @desc This function is being used to to get brands template library
   * @author Innovify
   * @since 29/01/2021
   * @param {Object} req Request
   * @param {String} req.pathParameters.brand_id Brand Id
   */
    async getTemplateLibrary (req) {
        if (!req.pathParameters.brand_id) {
            return Utils.errorResponse(undefined, Message.BRAND_ID_REQUIRED);
        }
        try {
            const brandId = req.pathParameters.brand_id;
            var params = {
                TableName: 'Templates',
                KeyConditionExpression: 'brand_id = :brand_id',
                ExpressionAttributeValues: {
                    ':brand_id': brandId
                }
            };

            const brands = await docClient.query(params).promise();
            if (brands.Count) {
                return Utils.successResponse(brands.Items);
            } else {
                return Utils.errorResponse(Message.NO_DATA_FOUND);
            }
        } catch (error) {
            return Utils.errorResponse('', error);
        }
    }
}
module.exports.getBrandTemplateLibraryHandler = async (event) => new BrandsTemplateLibrary().getTemplateLibrary(event);
