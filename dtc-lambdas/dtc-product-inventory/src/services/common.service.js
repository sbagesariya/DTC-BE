const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
/**
 * @name CommonService Common service functions
*/
class CommonService {
    /**
    * @desc This function is being used to fulfullment preference of brand
    * @param {String} brandId Brand Id
    */
    static async getBrandFulfillmentPreference (brandId, projection) {
        const params = {
            TableName: 'Brands',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            }
        };
        if (projection) {
            params.ProjectionExpression = projection;
        }
        const data = await docClient.query(params).promise();
        return data.Items.length ? data.Items[0] : {};
    }

}

module.exports = CommonService;
