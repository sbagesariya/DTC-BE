const Logger = require('./../../utils/logger');
const AWS = require('aws-sdk');
const ses = new AWS.SES({
    region: 'us-east-1'
});
class EmailService {

    /**
     * @desc This function is being used to to create email aws/ses template
     * @author Innovify
     * @since 22/12/2020
     * @param {String} templateName Template name
     * @param {String} subject Eamil subject
     * @param {String} templateHTML HTML template
     */
    static async createTemplate (templateName, subject, email, templateHTML, templateData) {
        const params = {
            'Template': {
                // This is the template name which you'll refer while sending through SES.
                'TemplateName': templateName,
                'SubjectPart': subject,
                'HtmlPart': templateHTML
            }
        };
        ses.getTemplate({ TemplateName: templateName }, async (err) => {
            if (err) {
                try {
                    await ses.createTemplate(params).promise();
                    Logger.info('createTemplate:', templateName);
                    this.sendEmail(templateName, email, templateData);
                } catch (error) {
                    Logger.error(`createTemplate: ${templateName}`, error);
                }
            } else {
                try {
                    await ses.updateTemplate(params).promise();
                    this.sendEmail(templateName, email, templateData);
                    Logger.info(`updateTemplate: ${templateName}`);
                } catch (error) {
                    Logger.error(`updateTemplate: ${templateName}`, error);
                }
            }
        });
    }

    /**
     * @desc This function is being used to to send place order email
     * @author Innovify
     * @since 22/12/2020
     * @param {String} templateName Template name
     * @param {Object} body Email object
     * @param {String} body.to Destination email address
     * @param {String} body.from Source email address
     * @param {String} templateData orderId
     */
    static async sendEmail (templateName, email, templateData) {
        var params = {
            Destination: { /* required */
                CcAddresses: [],
                ToAddresses: email.to || []
            },
            Source: email.from || [], /* required */
            Template: templateName, /* required */
            TemplateData: templateData || '{}', /* required */
            ReplyToAddresses: []
        };
        // Create the promise and SES service object
        try {
            await new AWS.SES({ apiVersion: '2010-12-01' }).sendTemplatedEmail(params).promise();
            Logger.info(`sendEmail: ${templateName}`);
        } catch (error) {
            Logger.error(`sendEmail Error: ${templateName}`, error);
        }
    }
}

module.exports = EmailService;
