const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('../../utils/message');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const CommonService = require('../services/common.service');

/**
 * @name ThirdPartyUpdateInventory class
 */
class ThirdPartyUpdateInventory {

    /**
    * @desc This function is being used to update product inventory detail
    * @author GrowExx
    * @since 27/12/2021
    * @param {Object} req Request
    * @param {Array} req.body RequestBody
    * @param {String} req.body.product_id sku_code (product_id in DTC)
    * @param {String} req.body.total_on_hand stock/search stock in DTC
    * @param {String} req.body.warehouse warehouse
    * @param {String} req.body.location location
    */
    async updateInventory (req, context, callback) {
        const body = JSON.parse(req.body);
        try {
            this.validateRequest(body);
            let inventoryCount = 0;
            for (const key in body) {
                if (Object.hasOwnProperty.call(body, key)) {
                    const ele = body[key];
                    inventoryCount += await this.updateFulfillmentInventory(ele);
                }
            }
            return callback(null, Utils.successResponse({ 'count': inventoryCount }));
        } catch (error) {
            Logger.error('updateInventory:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
    * @desc This function is being used to update product inventory detail
    * @author GrowExx
    * @since 28/12/2021
    * @param {Object} ele Inventory request object
    */
    async updateFulfillmentInventory (ele) {
        let inventoryCount = 0;
        if (ele.product_id && (ele.total_on_hand || ele.warehouse)) {
            const inventory = await CommonService.getInventoryByPoNumber('Fulfillment_inventory', ele, 'fulfillment_center_id, createdAt');
            if (inventory.Items.length) {
                inventory.Items.forEach(async (data) => {
                    const params = this.prepareQuery('Fulfillment_inventory', data, ele);
                    docClient.update(params, (err) => {
                        if (err) {
                            Logger.error('updateFulfillmentInventory:update', err);
                        }
                    });
                });
                inventoryCount = inventory.Items.length;
            } else {
                Logger.info('updateFulfillmentInventory:Fulfillment inventory not found', ele);
            }
        }
        return inventoryCount;
    }

    /**
    * @desc This function is being used to prepare update query for product inventory detail
    * @author GrowExx
    * @since 29/12/2021
    * @param {String} tableName Table Name
    * @param {Object} data Inventory object
    * @param {Object} ele Inventory request object
    */
    prepareQuery (tableName, data, ele) {
        var params = {
            TableName: tableName,
            Key: data
        };
        params.UpdateExpression = 'SET';
        params.ExpressionAttributeValues = {};
        if (ele.warehouse) {
            params.UpdateExpression = params.UpdateExpression + ' warehouse = :warehouse, location_group = :warehouse,';
            params.ExpressionAttributeValues[':warehouse'] = ele.warehouse;
        }
        if (ele.total_on_hand) {
            params.UpdateExpression = params.UpdateExpression + ' search_stock = :search_stock,';
            params.ExpressionAttributeValues[':search_stock'] = (ele.total_on_hand).toString();
            params.UpdateExpression = params.UpdateExpression + ' stock = :stock,';
            params.ExpressionAttributeValues[':stock'] = parseInt(ele.total_on_hand);
        }
        if (ele.location) {
            params.UpdateExpression = params.UpdateExpression + ' #location = :location,';
            params.ExpressionAttributeNames = {
                '#location': 'location'
            };
            params.ExpressionAttributeValues[':location'] = ele.location;
        }
        params.UpdateExpression = params.UpdateExpression.slice(0, -1);
        return params;
    }
    /**
     * @desc This function is being used get order data
     * @author GrowExx
     * @since 03/11/2021
     * @param {Object} body RequestBody
     */
    async validateRequest (body) {
        if (!Array.isArray(body) || !body.length) {
            throw Message.INVALID_REQUEST;
        } else {
            return;
        }
    }
}
module.exports.ThirdPartyUpdateInventoryHandler = async (event, context, callback) =>
    new ThirdPartyUpdateInventory().updateInventory(event, context, callback);
