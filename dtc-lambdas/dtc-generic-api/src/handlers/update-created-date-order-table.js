const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Message = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class UpdateCreatedDate {

    /**
    * @desc This function is being used to update randomly created date
    */
    async updateCreatedDate (req, context, callback) {
        try {
            var params = {
                TableName: 'Order'
            };
            const orders = await docClient.scan(params).promise();
            this.updateCreatedFieldData(orders.Items);
            return callback(null, Utils.successResponse({}, Message.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('updateCreatedDate:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to update randomly created date
     * @param {*} orders
     */
    async updateCreatedFieldData (orders) {
        var params = {
            TableName: 'Order'
        };
        var deleteParams = {
            TableName: 'Order'
        };
        orders.forEach(async (data) => {
            if (data.brand_id !== '' && data.createdAt !== '') {
                deleteParams.Key = { brand_id: data.brand_id, createdAt: data.createdAt };

                const newData = data;
                let created_at = this.randomDate(new Date(2021, 1, 5), new Date());
                const date = new Date(created_at);
                created_at = date.getTime();
                const placedOn = `${('0' + (date.getMonth() + 1)).slice(-2)}/${('0' + date.getDate()).slice(-2)}/${date.getFullYear()}`;
                newData.createdAt = created_at;
                newData.search_placed_on = placedOn;
                console.log('Delete Records::::::::');
                try {
                    await docClient.delete(deleteParams).promise();
                } catch (error) {
                    Logger.error('updateCreatedDate:catch', error);
                    return Utils.errorResponse(error);
                }
                params.Item = newData;
                console.log('Insert Records::::::::');
                await docClient.put(params).promise();
            }
        });
        return true;
    }

    randomDate (start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    }
}

module.exports.updateCreatedDateOrderTableHandler = async (event, context, callback) =>
    new UpdateCreatedDate().updateCreatedDate(event, context, callback);
