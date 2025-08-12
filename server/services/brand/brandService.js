var config = require('../../../config/config');
var AWS = require("aws-sdk");

AWS.config.update(config.aws_config);
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Class represents services for brand detail.
 */
class BrandService {

    getBrandDetails (req, res, callback) {
        var templateId = parseInt(req.params.id);
        var params = {
            TableName: 'Templates',
            Select: 'SPECIFIC_ATTRIBUTES',
            ProjectionExpression: 'logo, header_background_color',
            KeyConditionExpression: '#name = :value',
            ExpressionAttributeNames: { // a map of substitutions for attribute names with special characters
                '#name': 'template_id'
            },
            ExpressionAttributeValues: { // a map of substitutions for all attribute values
              ':value': templateId,
            },
            Limit: 1
        };
        docClient.query(params, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    }
}

module.exports = BrandService;
