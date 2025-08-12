const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class RemoveInventoryProduct {

    /**
    * @desc This function is being used to remove inventory product
    * @param {Object} req Request
    * @param {Object} req.pathParameters RequestPathParameters
    * @param {String} req.pathParameters.retailerId Retailer Id
    * @param {String} req.pathParameters.createdAt created At
    */
    async removeInventoryProduct (req, context, callback) {
        const body = req.pathParameters;
        return this.validateRequest(body).then(async (inventory) => {
            try {
                var params = {
                    TableName: 'Inventory',
                    Key: {
                        retailer_id: req.pathParameters.retailerId,
                        createdAt: parseInt(req.pathParameters.createdAt)
                    }
                };
                await docClient.delete(params).promise();
                this.getAvailableInventoryProducts(inventory);
                return callback(null, Utils.successResponse({}, Message.DELETED_SUCCESSFULLY));
            } catch (error) {
                Logger.error('removeInventoryProduct:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('removeInventoryProduct:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
    * @desc This function is being used to validate remove inventory product request
    * @param {String} body.retailerId Retailer Id
    * @param {String} body.createdAt created At
    */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.retailerId || !body.createdAt) {
                reject(Message.INVALID_REQUEST);
            } else {
                const params = {
                    TableName: 'Inventory',
                    KeyConditionExpression: 'retailer_id = :retailer_id AND createdAt = :createdAt',
                    ExpressionAttributeValues: {
                        ':retailer_id': body.retailerId,
                        ':createdAt': parseInt(body.createdAt)
                    }
                };
                const data = await docClient.query(params).promise();
                if (data.Count > 0) {
                    resolve(data.Items);
                }
                reject(Message.NO_RECORD_FOUND);
            }
        });
    }

    /**
    * @desc This function is being used get available products in inventory
    * @param {Array} body
    * @param {String} body.product_id Product Id
    * @param {String} body.brand_id Brand Id
    */
    async getAvailableInventoryProducts (inventory) {
        const params = {
            TableName: 'Inventory',
            KeyConditionExpression: 'brand_id = :brand_id',
            FilterExpression: 'product_id = :product_id',
            ExpressionAttributeValues: {
                ':brand_id': inventory[0].brand_id,
                ':product_id': inventory[0].product_id
            },
            IndexName: 'brand_id-index'
        };
        const data = await docClient.query(params).promise();
        if (data.Count === 0) {
            this.updateProductStatus(inventory[0]);
        }
    }

    /**
    * @desc This function is being used to update product status
    * @param {Array} body
    * @param {String} body.product_id Product Id
    * @param {String} body.brand_id Brand Id
    */
    updateProductStatus (data) {
        var params = {
            TableName: 'Products',
            Key: {
                brand_id: data.brand_id,
                product_id: data.product_id
            },
            UpdateExpression: 'SET #product_status = :product_status',
            ExpressionAttributeNames: {
                '#product_status': 'product_status'
            },
            ExpressionAttributeValues: {
                ':product_status': 0
            }
        };
        docClient.update(params).promise();
    }
}
module.exports.removeInventoryProductHandler = async (event, context, callback) =>
    new RemoveInventoryProduct().removeInventoryProduct(event, context, callback);
