const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');
const TemplateModel = require('./../../model/templates.model');
const Message = require('./../../utils/message');
const SavedTemplateModel = require('./../../model/saved-templates.model');

/**
 * @name AddSelectedTemplate class
 * @author Innovify
 */
class AddSelectedTemplate {
    /**
     * @desc This function is being used to to add selected template
     * @author Innovify
     * @since 05/02/2021
     */
    async addSelectedTemplate (req) {
        const body = JSON.parse(req.body);
        body.active = false;
        return this.validateRequest(body).then(async () => {
            try {
                const template = new TemplateModel(body);
                const savedTemplate = new SavedTemplateModel(body);
                return Promise.all([
                    await savedTemplate.save(),
                    await template.save()
                ]).then(() => {
                    return Utils.successResponse();
                }).catch((err) => {
                    Logger.error('addSelectedTemplate:Promise.all', err);
                    return Utils.errorResponse(err);
                });
            } catch (error) {
                Logger.error('addSelectedTemplate:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('addSelectedTemplate:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    /**
     * @desc This function is being used to validate add template request
     * @author Innovify
     * @since 04/02/2021
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
module.exports.AddSelectedTemplateHandler = async (event, context, callback) =>
    new AddSelectedTemplate().addSelectedTemplate(event, context, callback);
