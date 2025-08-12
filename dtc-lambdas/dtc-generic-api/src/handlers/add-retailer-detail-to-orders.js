/**
 * @desc Class represent generic function to remove item from table
 * @since 10/12/2020
 */
const dynamodb = require('aws-sdk/clients/dynamodb');
const dynamoClient = new dynamodb.DocumentClient();
const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/constant');
const Logger = require('./../../utils/logger');
const RetailerPortalUsers = [
    {
        'user_id': '274ae582-f510-4885-a3b1-f1682acbf4c8',
        'email': 'dcleverley0_retailer@wunderground.com',
        'first_name': 'Dominica Retailer',
        'last_name': 'Cleverley'
    }, {
        'user_id': '07f751ba-e845-4489-8ca3-823e4c9852e5',
        'email': 'cfinlason1_retailer@apache.org',
        'first_name': 'Collin Retailer',
        'last_name': 'Finlason'
    }, {
        'user_id': '1b3209d1-0e86-474e-9aa2-e4369b778e69',
        'email': 'aderrickh_retailer@mozilla.com',
        'first_name': 'Adelind Retailer',
        'last_name': 'Derrick'
    }];

class AddRetailerDetailToOrders {

    /**
     * @desc This function is being used to get retailers
     * @since 09/04/2021
     */
    async addRetailerDetailToOrders (req, context, callback) {
        try {
            const params = {
                TableName: 'Order'
            };
            const orders = await dynamoClient.scan(params).promise();
            await this.prepareReq(orders.Items);
            return callback(null, Utils.successResponse({}, Message.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('addRetailerDetailToOrders:-', error);
            return Utils.errorResponse(Message.COMMON.SOMETHING_WENT_WRONG, error);
        }
    }

    /**
     * @desc This function is being used to update/add retailers details into orders
     * @since 09/04/2021
     */
    async prepareReq (orders) {
        try {
            const batchUpdateQuery = {
                RequestItems: {
                    'Order': {}
                }
            };
            var itemsArray = [];
            orders.forEach(async (value, index) => {
                const randomInt = this.getRandomInt(0, 3);
                const retailer = RetailerPortalUsers[randomInt];
                value.retailer_id = retailer.user_id;
                value.retailer = `${retailer.first_name} ${retailer.last_name}`;
                value.search_retailer = `${retailer.first_name} ${retailer.last_name}`.toLowerCase();
                value.user_detail.phone = value.user_detail.phone.toString();
                delete value.retailer_name;
                delete value.search_retailer_name;
                const item = {
                    PutRequest: {
                        Item: value
                    }
                };
                itemsArray.push(item);
                if (index === orders.length - 1 || itemsArray.length === 25) {
                    batchUpdateQuery.RequestItems.Order = itemsArray;
                    dynamoClient.batchWrite(batchUpdateQuery, (err, data) => {
                        if (err) {
                            Logger.error(itemsArray.length, 'addRetailerDetailToOrders:-prepareReq', err);
                        } else {
                            Logger.info(itemsArray.length, 'addRetailerDetailToOrders:-Sucess', data);
                        }
                    });
                    itemsArray = [];
                    Logger.info('addRetailerDetailToOrders:-Sucess');
                }
            });
        } catch (error) {
            Logger.error('addRetailerDetailToOrders:-prepareReq', error);
        }
    }

    /**
     * @desc This function is being used to get random number between two number
     * @since 09/04/2021
     */
    getRandomInt (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        // The maximum is exclusive and the minimum is inclusive
        return Math.floor(Math.random() * (max - min) + min);
    }

}

module.exports.AddRetailerDetailToOrdersHandler = async (event, context, callback) =>
    new AddRetailerDetailToOrders().addRetailerDetailToOrders(event, context, callback);
