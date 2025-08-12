
const Constant = require('../../utils/constant');
const Logger = require('../../utils/logger');
const ParameterStore = require('./../../utils/ssm');
const superagent = require('superagent');

/**
 * @name NavigatorService Navigator service functions
*/
class NavigatorService {
    /**
     * @desc This function is being used to get navigator public group token key from AWS KMS
     */
    static async getNavigatorKeyToken () {
        return await ParameterStore.getValue(Constant.PARKSTREET_NAVIGATOR.LNJ_GROUP_TOKEN);
    }

    /**
     * @desc This function is being used call navigator API
     * @param {String} keyId Navigator public group API token
     * @param {String} endPoint API end point
     * @param {body} body Request body
     */
    static callNavigatorAPI (keyId, endPoint, body) {
        return new Promise((resolve, reject) => {
            superagent
                .post(process.env.NAV_PUBLIC_API_URL + endPoint)
                .send(body)
                .query({ token: keyId })
                .end((err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.body);
                    }
                });
        });
    }

    /**
     * @desc This function is being used call API to update product inventory
     * @param {body} body Request body
     */
    static updateProductInventory (body) {
        try {
            superagent
                .post(process.env.DTC_UPDATE_FULFILLENT_INVENTORY_URL + Constant.API.UPDATE_PRODUCT_INVENTORY)
                .send(body)
                .set({ 'X-API-Key': process.env.DTC_UPDATE_FULFILLENT_INVENTORY_APIKEY })
                .end((err, result) => {
                    if (err) {
                        Logger.error('updateProductInventory: err', err);
                    } else {
                        Logger.info('updateProductInventory', result);
                    }
                });
        } catch (error) {
            Logger.error('updateProductInventory: catch', error);
        }
    }

    /**
     * @desc This function is being used to get product inventory snapshot
     * @param {String} productId productId
     */
    static async getProductInventorySnapshot (productId) {
        const keyId = await this.getNavigatorKeyToken();
        const reqBody = { sku: productId };
        let result = {};
        const resultData = await this.callNavigatorAPI(keyId, '/public_apis/get_product_inventory_snapshot', reqBody);
        if (resultData.hasError === false && resultData.data) {
            result = resultData.data;
        } else {
            Logger.info('getProductInventorySnapshot: Get', reqBody);
        }
        return result;
    }

    /**
     * @desc This function is being used to get navigator order status
     * @param {Array} salesOrderId Sales Order Id
     */
    static async getNavigatorOrderStatus (salesOrderId) {
        const keyId = await this.getNavigatorKeyToken();
        const reqBody = { sales_order_id: salesOrderId };
        return this.callNavigatorAPI(keyId, Constant.GET_SALES_ORDER_API_ENDPOINT, reqBody).then((resultData) => {
            let result = [];
            if (resultData.hasError === false && resultData.data) {
                result = resultData.data[0];
            }
            return result;
        }).catch((err) => {
            Logger.error('getNavigatorOrderStatus:catch', err);
        });
    }
}
module.exports = NavigatorService;
