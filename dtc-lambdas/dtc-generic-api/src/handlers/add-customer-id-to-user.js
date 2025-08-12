const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * @name AddCustomerIdToUser class
 * @author GrowExx
 */
class AddCustomerIdToUser {

    async addCustomerIdToUser (req, context, callback) {
        try {
            var params = {
                TableName: 'Users',
                FilterExpression: 'attribute_not_exists(customer_id)'
            };
            const usersData = await docClient.scan(params).promise();
            this.addCustomerId(usersData.Items);
            return callback(null, Utils.successResponse({}));
        } catch (error) {
            Logger.error('addCustomerIdToUser:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add customer id
     * @param {*} items
     */
    addCustomerId (items) {
        items.forEach(async (data) => {
            data.customer_id = this.customerId(data.first_name);
            var params = {
                TableName: 'Users',
                Item: data
            };
            docClient.put(params).promise();
        });
    }

    /**
     * Function to generate customer id
     * @param {String} firstName First Name
     */
    customerId (firstName) {
        const name = (firstName.substring(0, 3)).toUpperCase();
        const uniqueNumber = `${Math.random().toString(16).substr(2, 14).toUpperCase()}`;
        return ['DTC', name, uniqueNumber.slice(2, 8)].join('-');
    }
}
module.exports.AddCustomerIdToUserHandler = async (req, context, callback) =>
    new AddCustomerIdToUser().addCustomerIdToUser(req, context, callback);
