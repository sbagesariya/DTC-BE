const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Constant = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const NavigatorService = require('./../services/navigator.service');

/**
 * @name UpdateProductInventory class
 */
class UpdateProductInventory {

    /**
     * @desc This function is being used to update product inventory form navigator
     * @param {String} req.brand_id brand Id
     */
    async updateProductInventory (req, context, callback) {
        try {
            const body = JSON.parse(req.body);
            let productInventory = [];
            if (body && body.brand_id) {
                productInventory = await this.getProductInventoryDataByBrand(Constant.FULFILLMENT_INVENTORY, body.brand_id);
            } else {
                productInventory = await this.getProductInventoryData(Constant.FULFILLMENT_INVENTORY);
            }
            if (productInventory.length) {
                productInventory.forEach(async (items) => {
                    const result = await NavigatorService.getProductInventorySnapshot(items.sku_code);
                    if (Object.keys(result).length !== 0) {
                        await this.updateProductInventoryData(Constant.FULFILLMENT_INVENTORY, items, result);
                    }
                });
            }
            return callback(null, Utils.successResponse({}, Constant.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('updateProductInventory:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to get specific brand product inventory
     * @param {String} tableName
     * @param {String} brandId brand Id
     */
    async getProductInventoryDataByBrand (tableName, brandId) {
        var params = {
            TableName: tableName,
            IndexName: 'brand_id-index',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': brandId
            },
            FilterExpression: 'attribute_exists(sku_code)'
        };
        const inventoryData = await docClient.query(params).promise();
        return (inventoryData.Items.length) ? inventoryData.Items : [];
    }

    /**
     * Function to get all brand product inventory
     * @param {String} tableName
     */
    async getProductInventoryData (tableName) {
        let allData = [];
        const getAllData = async (params) => {
            const data = await docClient.scan(params).promise();
            if (data.Items.length > 0) {
                allData = [...allData, ...data.Items];
            }
            if (data.LastEvaluatedKey) {
                params.ExclusiveStartKey = data.LastEvaluatedKey;
                return await getAllData(params);

            } else {
                return data;
            }
        };
        const params = {
            TableName: tableName,
            FilterExpression: 'attribute_exists(sku_code)'
        };
        await getAllData(params);
        return (allData.length) ? allData : [];
    }

    /**
     * Function to update product inventory form navigator
     * @param {String} tableName
     * @param {Object} items
     * @param {Object} result
     */
    async updateProductInventoryData (tableName, items, result) {
        result.warehouse.forEach(async (inventory) => {
            if (inventory.location_group === Constant.CBA_WAREHOUSE) {
                const params = {
                    TableName: tableName,
                    Key: { fulfillment_center_id: items.fulfillment_center_id, createdAt: items.createdAt },
                    UpdateExpression: `SET stock = :stock, search_stock = :search_stock, unit_price = :unit_price,
                    warehouse = :warehouse, location_group = :warehouse, #location = :location`,
                    ExpressionAttributeNames: {
                        '#location': 'location'
                    },
                    ExpressionAttributeValues: {
                        ':stock': parseInt(inventory.total_on_hand.replace(/,/g, '')),
                        ':search_stock': inventory.total_on_hand,
                        ':warehouse': inventory.location_group,
                        ':location': inventory.location,
                        ':unit_price': parseFloat(inventory.price)
                    }
                };
                await docClient.update(params).promise();
            }
        });
    }
}

module.exports.updateProductInventoryHandler = async (event, context, callback) =>
    new UpdateProductInventory().updateProductInventory(event, context, callback);
