const Utils = require('../../utils/lambda-response');
const Message = require('../../utils/message');
const Logger = require('../../utils/logger');
const dynamodb = require('aws-sdk/clients/dynamodb');
const Constants = require('../../utils/constants');
const docClient = new dynamodb.DocumentClient();
const AWS = require('aws-sdk');
const amplify = new AWS.Amplify();

class GetAllBrandDomains {

    /**
     * @desc This function is being used to to get all brand domains
     * @param {String} req.pathParameters pathParameters
     * @param {String} req.pathParameters.brand_id Brand Id
     */
    async getAllBrandDomains (req) {
        if (!req.pathParameters.brand_id) {
            return Utils.errorResponse(Message.DOMAIN.BRAND_ID_REQUIRED);
        }
        try {
            var params = {
                TableName: 'Brand_domains',
                KeyConditionExpression: 'brand_id = :brand_id',
                ExpressionAttributeValues: {
                    ':brand_id': req.pathParameters.brand_id
                }
            };
            const data = await docClient.query(params).promise();
            const result = [];
            if (data.Items) {
                const appId = data.Items[0].app_id;
                const params = { appId };
                const domains = await amplify.listDomainAssociations(params).promise();
                domains.domainAssociations.forEach(element => {
                    var res = {};
                    res.domainName = element.domainName;
                    res.domainStatus = (element.domainStatus === Constants.EXP_AVAILABLE) ? Constants.CONNECTED : Constants.NOT_CONNECTED;
                    res.assigned_by = this.getAssignedBy(data.Items, res.domainName);
                    result.push(res);
                });
            }
            return Utils.successResponse(result);
        } catch (error) {
            Logger.error('getAllBrandDomains:catch', error);
            return Utils.errorResponse(error);
        }
    }

    /**
     * @desc This function is being used to to get Assigned By
     * @param {Array} data data
     * @param {String} domainName DomainName
     */
    getAssignedBy (data, domainName) {
        var assignedBy = '';
        data.forEach(element => {
            if (element.domain_name === domainName) {
                assignedBy = element.assigned_by;
            }
        });
        return assignedBy;
    }
}

module.exports.getAllBrandDomainsHandler = async (event) => new GetAllBrandDomains().getAllBrandDomains(event);
