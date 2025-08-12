const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class GetAllBrands {

    /**
    * @desc This function is being used to get all brands
    * @param {Object} req Request
    * @param {Object} req.body RequestBody
    * @param {String} req.body.search_brand search brand
    */
    async getAllBrands (req) {
        try {
            const body = JSON.parse(req.body);
            var params = {
                TableName: 'Brands',
                ProjectionExpression: 'brand_id, brand_name, search_brand_name'
            };
            if (body.search_brand && body.search_brand !== '') {
                params.FilterExpression = 'contains(search_brand_name, :search_brand)';
                params.ExpressionAttributeValues = {
                    ':search_brand': (body.search_brand).toLowerCase()
                };
            }
            const data = await docClient.scan(params).promise();
            const brandData = data.Items;
            brandData.sort((a, b) => (a.search_brand_name > b.search_brand_name ? 1 : -1));
            const result = [];
            brandData.forEach(item => {
                result.push({
                    id: item.brand_id,
                    name: item.brand_name
                });
            });
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getOrdersByBrand:catch', error);
            return Utils.errorResponse(error);
        }
    }
}

module.exports.getAllBrandsHandler = async (event) =>
    new GetAllBrands().getAllBrands(event);
