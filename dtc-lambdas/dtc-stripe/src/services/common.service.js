const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const moment = require('moment');
const Message = require('./../../utils/message');
const Logger = require('./../../utils/logger');
const UUID = require('uuid');

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
            throw `${Message.ORDER.NOT_FOUND} in ${tableName}`;
        } else {
            return data.Items[0];
        }
    }

    /**
     * @desc This function is being used to generate unique random string for order
     */
    static orderNumber () {
        const now = Date.now().toString();
        const second = Math.random().toString(16).substring(2, 14).toUpperCase();
        const first = `${now}${Math.floor(Math.random() * 10)}`;
        return [first.slice(7, 13), second.slice(2, 7)].join('-');
    }

    /**
     * @desc This function is being used to update auto increment number
     * @param {body} item item
     */
    static updateAutoIncrementNumber (item) {
        const params = {
            TableName: 'Auto_increment',
            Item: item
        };
        docClient.put(params, (err)=> {
            if (err) {
                Logger.error(err);
            }
        });
    }

    /**
     * @desc This function is being used to add bussiness days only in a date
     * @param {Date} date Current date
     * @param {Number} daysToAdd Number of business days to add in a date
     */
    static addBusinessDays (date, daysToAdd) {
        var cnt = 0;
        var tmpDate = moment(date);
        while (cnt < daysToAdd) {
            tmpDate = tmpDate.add(1, 'days');
            if (tmpDate.weekday() !== moment().day('Sunday').weekday() && tmpDate.weekday() !== moment().day('Saturday').weekday()) {
                cnt = cnt + 1;
            }
        }
        return tmpDate;
    }

    /**
     * @desc This function is being used to log orders created transactions
     * @param {String} userId User id
     * @param {Array} orders Orders
     */
    static logOrderTransaction (userId, orders) {
        const item = orders.map(obj=> ({ order_id: obj.order_id }));
        const params = {
            TableName: 'Order_transactions',
            Item: {
                user_id: userId,
                transaction_id: UUID.v4(),
                orders: item,
                createdAt: new Date().getTime(),
                updatedAt: new Date().getTime()
            }
        };
        docClient.put(params, (err)=> {
            if (err) Logger.error(err);
        });

    }

}

module.exports = CommonService;
