const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const Constant = require('./../../utils/constant');
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

class AddMinMaxProductContent {

    /**
    * @desc This function is being used to add min max product filed data
    */
    async addMinMaxProductContent (req, context, callback) {
        try {
            this.updateMinMaxProductContentData(process.env.TEMPLATE_MASTER_TABLE);
            this.updateMinMaxProductContentData(process.env.SAVED_TEMPLATES_TABLE);
            this.updateMinMaxProductContentData(process.env.TEMPLATES_TABLE);
            return callback(null, Utils.successResponse({}, Constant.COMMON.UPDATED_SUCCESSFULLY));
        } catch (error) {
            Logger.error('addMinMaxProductContent:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * Function to add min max product filed data
     * @param String tableName
     */
    async updateMinMaxProductContentData (tableName) {
        var params = {
            TableName: tableName
        };
        const templatedata = await docClient.scan(params).promise();
        templatedata.Items.forEach(async (data) => {
            let minProduct = 0;
            let maxProduct = 0;
            let minContent = 0;
            let maxContent = 0;
            switch (data.template_name) {
                case Constant.TEMPLATE_1.NAME:
                    minProduct = Constant.TEMPLATE_1.MIN_PRODUCT_LIMIT;
                    maxProduct = Constant.TEMPLATE_1.MAX_PRODUCT_LIMIT;
                    minContent = Constant.TEMPLATE_1.MIN_CONTENT_CARD_LIMIT;
                    maxContent = Constant.TEMPLATE_1.MAX_CONTENT_CARD_LIMIT;
                    break;
                case Constant.TEMPLATE_2.NAME:
                    minProduct = Constant.TEMPLATE_2.MIN_PRODUCT_LIMIT;
                    maxProduct = Constant.TEMPLATE_2.MAX_PRODUCT_LIMIT;
                    break;
                case Constant.TEMPLATE_3.NAME:
                    minProduct = Constant.TEMPLATE_3.MIN_PRODUCT_LIMIT;
                    maxProduct = Constant.TEMPLATE_3.MAX_PRODUCT_LIMIT;
                    break;
                case Constant.TEMPLATE_4.NAME:
                    minProduct = Constant.TEMPLATE_4.MIN_PRODUCT_LIMIT;
                    maxProduct = Constant.TEMPLATE_4.MAX_PRODUCT_LIMIT;
                    break;
                case Constant.TEMPLATE_5.NAME:
                    minProduct = Constant.TEMPLATE_5.MIN_PRODUCT_LIMIT;
                    maxProduct = Constant.TEMPLATE_5.MAX_PRODUCT_LIMIT;
                    minContent = Constant.TEMPLATE_5.MIN_CONTENT_CARD_LIMIT;
                    maxContent = Constant.TEMPLATE_5.MAX_CONTENT_CARD_LIMIT;
                    break;
                default:
                    minProduct = maxProduct = minContent = maxContent = 0;
            }
            if (tableName === process.env.TEMPLATE_MASTER_TABLE) {
                params.Key = { template_id: data.template_id };
            } else {
                params.Key = { brand_id: data.brand_id, template_id: data.template_id };
            }
            params.UpdateExpression = `set min_content_product = :min_content_product, max_content_product = :max_content_product,
            min_content_card_limit = :min_content_card_limit, max_content_card_limit = :max_content_card_limit`;
            params.ExpressionAttributeValues = {
                ':min_content_product': minProduct,
                ':max_content_product': maxProduct,
                ':min_content_card_limit': minContent,
                ':max_content_card_limit': maxContent
            };
            await docClient.update(params).promise();
        });
    }
}

module.exports.addMinMaxProductContentHandler = async (event, context, callback) =>
    new AddMinMaxProductContent().addMinMaxProductContent(event, context, callback);
