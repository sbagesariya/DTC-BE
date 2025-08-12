const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Message = require('./../../utils/constant');
/**
 * @name CommonService Common service functions
*/
class CommonService {
    /**
    * @desc This unction is being used to get brand details
    * @param {String} tableName Brand Id
    * @param {String} keyCondition Brand Id
    * @param {String} keyName Brand Id
    * @param {String} projection projection
    */
    static async getDetails (tableName, keyCondition, keyName, projection) {
        var params = {
            TableName: tableName,
            KeyConditionExpression: `${keyName} = :${keyName}`,
            ExpressionAttributeValues: {}
        };
        params.ExpressionAttributeValues[`:${keyName}`] = keyCondition;
        if (projection) {
            params.ProjectionExpression = projection;
        }
        const data = await docClient.query(params).promise();
        if (!data.Items.length) {
            throw Message.NO_RECORD_FOUND;
        } else {
            return data.Items[0];
        }
    }

    /**
     * @desc This function is being used to get fulfillment center name
     * @since 15/03/2022
     * @param {String} brandId Brand Id
     * @param {String} fulfillmentCenterId Fulfillment center ID
     */
    static async getFufillmentCenterDetails (brandId, fulfillmentCenterId) {
        const params = {
            TableName: 'Fulfillment_centers',
            KeyConditionExpression: 'brand_id = :brand_id AND fulfillment_center_id = :fulfillment_center_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId,
                ':fulfillment_center_id': fulfillmentCenterId
            }
        };
        const data = await docClient.query(params).promise();
        return (data.Items.length) ? data.Items[0] : '';
    }
}

module.exports = CommonService;
