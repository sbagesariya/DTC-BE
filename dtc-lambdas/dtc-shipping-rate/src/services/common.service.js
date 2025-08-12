const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Message = require('./../../utils/message');
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
}

module.exports = CommonService;
