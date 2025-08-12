const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/message');
const Logger = require('../../utils/logger');
const Constants = require('../../utils/constants');
const ParameterStore = require('../../utils/ssm');
const AWS = require('aws-sdk');
let ACCESS_KEY_ID = '';
let SECRET_ACCESS_KEY = '';
let SESSION_TOKEN = '';

class CheckSubDomainAvailibility {

    async checkAvailibility (req, context, callback) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async () => {
            try {
                var domainAvailibiilty = await ParameterStore.getValue('domain_availibiilty');
                domainAvailibiilty = domainAvailibiilty.split(',');
                var params = {
                    RoleArn: domainAvailibiilty[0],
                    RoleSessionName: domainAvailibiilty[1]
                };
                var sts = new AWS.STS();
                const response = await sts.assumeRole(params).promise();
                var result = {};
                var availibility = Constants.NOT_AVAILABLE;
                if (response) {
                    ACCESS_KEY_ID = response.Credentials.AccessKeyId;
                    SECRET_ACCESS_KEY = response.Credentials.SecretAccessKey;
                    SESSION_TOKEN = response.Credentials.SessionToken;

                    var options = {
                        accessKeyId: ACCESS_KEY_ID,
                        secretAccessKey: SECRET_ACCESS_KEY,
                        sessionToken: SESSION_TOKEN
                    };
                    result = await this.testRoute53(options, body, domainAvailibiilty[2]);
                    availibility = (result.ResponseCode === Constants.NOERROR) ? Constants.NOT_AVAILABLE : Constants.AVAILABLE;
                }
                return callback(null, Utils.successResponse({ 'status': availibility }));
            } catch (error) {
                Logger.error('checkAvailibility:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('checkAvailibility:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    validateRequest (body) {
        return new Promise((resolve, reject) => {
            if (!body.domain_name) {
                reject(Message.DOMAIN.DOMAIN_NAME_REQUIRED);
            } else {
                resolve();
            }
        });
    }

    async testRoute53 (options, body, zoneId) {
        var route53 = new AWS.Route53(options);
        var params = {
            HostedZoneId: zoneId,
            RecordName: body.domain_name,
            RecordType: 'CNAME'
        };
        return await route53.testDNSAnswer(params).promise();
    }
}
module.exports.checkSubDomainAvailibilityHandler = async (event, context, callback) =>
    new CheckSubDomainAvailibility().checkAvailibility(event, context, callback);
