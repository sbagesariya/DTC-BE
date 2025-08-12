const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/message');
const Logger = require('../../utils/logger');
const AWS = require('aws-sdk');
const amplify = new AWS.Amplify();

class GetDomainAssociation {
    async getAssociation (req) {
        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (domainData) => {
            try {
                var data = {};
                var params = {
                    appId: domainData.Items[0].app_id,
                    domainName: body.domain_name.toLowerCase()

                };
                const result = await amplify.getDomainAssociation(params).promise();
                data.dns = result.domainAssociation.subDomains[0].dnsRecord;
                data.certificate = result.domainAssociation.certificateVerificationDNSRecord;
                data.status = result.domainAssociation.domainStatus;
                return Utils.successResponse(data);
            } catch (error) {
                Logger.error('getDomainAssociation:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('getDomainAssociation:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.domain_name) {
                reject(Message.DOMAIN.DOMAIN_NAME_REQUIRED);
            } else if (!body.brand_id) {
                reject(Message.DOMAIN.BRAND_ID_REQUIRED);
            } else {
                const params = {
                    TableName: 'Brand_domains',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    }
                };
                const domainData = await docClient.query(params).promise();
                resolve(domainData);
            }
        });
    }
}

module.exports.getDomainAssociationHandler = async (event, context, callback) =>
    new GetDomainAssociation().getAssociation(event, context, callback);
