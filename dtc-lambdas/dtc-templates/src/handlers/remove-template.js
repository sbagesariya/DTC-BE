const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const SavedTemplateModel = require('../../model/saved-templates.model');
const TemplateModel = require('../../model/templates.model');

/**
 * @name removeTemplate class
 * @author Innovify
 */
class RemoveTemplate {
    /**
     * @desc This function is being used to remove template data
     * @author Innovify
     * @since 05/02/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.template_id Template Id
     */
    async removeTemplate (req) {
        const body = req.queryStringParameters;
        return this.validateRequest(body).then(async () => {
            try {
                await SavedTemplateModel.delete({ 'brand_id': body.brand_id, 'template_id': body.template_id, 'active': false });
                await TemplateModel.delete({ 'brand_id': body.brand_id, 'template_id': body.template_id, 'active': false });
                return Utils.successResponse(null, Message.TEMPLATE_REMOVED);
            } catch (error) {
                Logger.error('removeTemplate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('removeTemplate:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate get saved template request
     * @author Innovify
     * @since 08/01/2021
     * @param {Object} req Request
     * @param {Object} req.body RequestBody
     * @param {String} req.body.brand_id Brand Id
     * @param {String} req.body.template_id Template Id
     */
    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.BRAND_ID_REQUIRED);
            } else if (!body.template_id) {
                reject(Message.TEMPLATE_ID_REQUIRED);
            } else {
                resolve();
            }
        });
    }
}
module.exports.removeTemplateHandler = async (event, context, callback) =>
    new RemoveTemplate().removeTemplate(event, context, callback);

