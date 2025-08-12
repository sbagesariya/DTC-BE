const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Message = require('./../../utils/message');
const Logger = require('../../utils/logger');
const UUID = require('uuid');
const AWS = require('aws-sdk');
const amplify = new AWS.Amplify();
const ParameterStore = require('../../utils/ssm');
const Constants = require('../../utils/constants');

let ACCESS_KEY_ID = '';
let SECRET_ACCESS_KEY = '';
let SESSION_TOKEN = '';

class CreateSubDomainUnderPS {
    async createSubDomain (req, context, callback) {

        const body = JSON.parse(req.body);
        return this.validateRequest(body).then(async (domainData) => {
            try {
                let appId;
                var result;
                if (domainData.Count > 0) {
                    appId = domainData.Items[0].app_id;
                    result = await this.createDomain(appId, body.domain_name);
                    this.addBrandDomain(appId, body);
                    this.verifyDomain(appId, body.domain_name);
                } else {
                    const application = await this.createApp(body);
                    appId = application.app.appId;
                    await this.createBranchForApp(appId);
                    result = await this.createDomain(appId, body.domain_name);
                    this.addBrandDomain(appId, body);
                    this.verifyDomain(appId, body.domain_name);
                }
                return callback(null, Utils.successResponse(result, 'Success'));
            } catch (error) {
                Logger.error('create Sub-domain:catch', error);
                return Utils.errorResponse(error);
            }
        }).catch((err) => {
            Logger.error('create Sub-domain:validateRequest', err);
            return Utils.errorResponse(err);
        });
    }

    validateRequest (body) {
        return new Promise(async (resolve, reject) => {
            if (!body.brand_id) {
                reject(Message.DOMAIN.BRAND_ID_REQUIRED);
            } else if (!body.domain_name) {
                reject(Message.DOMAIN.DOMAIN_NAME_REQUIRED);
            } else if (!body.brand_name) {
                reject(Message.DOMAIN.BRAND_NAME_REQUIRED);
            } else {
                const params = {
                    TableName: 'Brand_domains',
                    KeyConditionExpression: 'brand_id = :brand_id',
                    ExpressionAttributeValues: {
                        ':brand_id': body.brand_id
                    },
                    ProjectionExpression: 'app_id'
                };
                const domainData = await docClient.query(params).promise();
                resolve(domainData);
            }
        });
    }

    async createApp (body) {
        var createDomain = await ParameterStore.getValue('create_domain');
        createDomain = createDomain.split(',');
        var params = {
            name: body.brand_name + Constants.APP,
            customRules: [
                {
                    source: Constants.SOURCE_ONE,
                    target: Constants.TARGET,
                    status: Constants.STATUS_NOT_FOUND
                },
                {
                    source: Constants.SOURCE_TWO,
                    target: Constants.TARGET,
                    status: Constants.STATUS_SUCCESS
                }
            ],
            autoBranchCreationConfig: {
                framework: Constants.FRAMEWORK,
                enableAutoBuild: true,
                enableBasicAuth: true,
                enablePerformanceMode: true,
                enablePullRequestPreview: true
            },
            platform: Constants.PLATFORM,
            repository: createDomain[0],
            oauthToken: createDomain[1],
            iamServiceRoleArn: createDomain[2]
        };
        return await amplify.createApp(params).promise();
    }

    async createBranchForApp (appId) {
        try {
            var params = {
                appId,
                branchName: process.env.DomainBranch
            };
            return await amplify.createBranch(params).promise();
        } catch (error) {
            Logger.error('CreateBranch:catch', error);
            return Utils.errorResponse(error);
        }
    }

    async createDomain (appId, domainName) {
        var createDomain = await ParameterStore.getValue('create_domain');
        createDomain = createDomain.split(',');
        try {
            var params = {
                appId,
                domainName,
                subDomainSettings: [
                    {
                        branchName: process.env.DomainBranch,
                        prefix: ''
                    }
                ],
                autoSubDomainCreationPatterns: [
                    'test'
                ],
                autoSubDomainIAMRole: createDomain[2],
                enableAutoSubDomain: true
            };
            return await amplify.createDomainAssociation(params).promise();
        } catch (error) {
            Logger.error('CreateError:catch', error);
            return { 'message': error.message };
        }
    }

    async addBrandDomain (appId, body) {
        const createdDate = await this.getBrandDomainData(body);
        var params = {
            TableName: 'Brand_domains',
            Item: {
                domain_id: UUID.v4(),
                brand_id: body.brand_id,
                app_id: appId,
                domain_name: body.domain_name,
                assigned_by: Constants.PARKSTREET,
                status: Constants.CONNECTED,
                createdAt: createdDate,
                updatedAt: new Date().getTime()
            }
        };
        await docClient.put(params).promise();
    }

    /**
     * Function to get brand domain data
     *
     * @param {Object} body Body
     */
    async getBrandDomainData (body) {
        const Params = {
            TableName: 'Brand_domains',
            KeyConditionExpression: 'brand_id = :brand_id',
            ExpressionAttributeValues: {
                ':brand_id': body.brand_id,
                ':domain_name': body.domain_name
            },
            FilterExpression: 'domain_name = :domain_name',
            ProjectionExpression: 'createdAt'
        };
        var result = await docClient.query(Params).promise();
        var createdAt = new Date().getTime();
        if (result.Count > 0) {
            createdAt = result.Items[0].createdAt;
        }
        return createdAt;
    }

    async verifyDomain (appId, domainName) {
        try {
            var params = {
                appId,
                domainName
            };
            await this.getValues(params, true);
        } catch (error) {
            Logger.error('verifyDomain:catch', error);
        }

    }

    async getValues (params, createVDNSCNAMERecords = false) {
        try {
            const setTimeInterval = setInterval(async () => {
                const data = await amplify.getDomainAssociation(params).promise();
                const VDNS = data.domainAssociation.certificateVerificationDNSRecord;
                const secondDNS = data.domainAssociation.subDomains[0].dnsRecord;
                if (createVDNSCNAMERecords) {
                    const isSdnsPending = secondDNS.includes('<pending>');
                    if (VDNS !== null && (secondDNS !== '' && isSdnsPending === false)) {
                        this.createSTS(VDNS, params.domainName);
                        this.createSTS(secondDNS, params.domainName, true);
                        await clearInterval(setTimeInterval);
                    }
                }
            }, 10000);
        } catch (error) {
            Logger.error('getValues:catch', error);
        }
    }

    async createSTS (VDNS, domainName, isSecondDNS = false) {
        try {
            var DOMAIN_PREFIX = '';
            var domainAvailibiilty = await ParameterStore.getValue('domain_availibiilty');
            domainAvailibiilty = domainAvailibiilty.split(',');
            var params = {
                RoleArn: domainAvailibiilty[0],
                RoleSessionName: domainAvailibiilty[1]
            };
            var sts = new AWS.STS();
            const response = await sts.assumeRole(params).promise();
            if (response) {
                ACCESS_KEY_ID = response.Credentials.AccessKeyId;
                SECRET_ACCESS_KEY = response.Credentials.SecretAccessKey;
                SESSION_TOKEN = response.Credentials.SessionToken;

                var options = {
                    accessKeyId: ACCESS_KEY_ID,
                    secretAccessKey: SECRET_ACCESS_KEY,
                    sessionToken: SESSION_TOKEN
                };
                var newDns = VDNS.split(' CNAME ');
                if (isSecondDNS) {
                    newDns[0] = DOMAIN_PREFIX + '.' + domainName;
                    newDns[0] = domainName;
                }
                this.testRoute53(options, newDns[0], newDns[1], domainAvailibiilty[2]);
            }
        } catch (error) {
            Logger.error('createSTS:catch', error);
        }
    }

    async testRoute53 (options, dnsName, dnsValue, zoneId) {
        try {
            // Create route53 object using credentials generated from the assumerole process.
            var route53 = new AWS.Route53(options);
            var params = {
                ChangeBatch: {
                    Changes: [{
                        Action: 'CREATE',
                        ResourceRecordSet: {
                            Name: dnsName,
                            ResourceRecords: [{
                                Value: dnsValue
                            }],
                            TTL: 3,
                            Type: 'CNAME'
                        }
                    }],
                    Comment: ''
                },
                HostedZoneId: zoneId
            };

            route53.changeResourceRecordSets(params, (err, data) => {
                if (err) { console.log(err, err.stack); }
                else { console.log(data); }
            });
        } catch (error) {
            Logger.error('testRoute53:catch', error);
        }
    }
}
module.exports.createSubDomainUnderPSHandler = async (event, context, callback) =>
    new CreateSubDomainUnderPS().createSubDomain(event, context, callback);
