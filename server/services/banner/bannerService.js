var config = require('../../../config/config');
var AWS = require("aws-sdk");

AWS.config.update(config.aws_config);
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Class represents services for banner detail.
 */
class BannerService {

    getBannerDetails (req, res, callback) {
        var params = {
            TableName: 'Templates',
            KeyConditionExpression: "template_id = :template_id",
            ExpressionAttributeValues: {
                ":template_id": parseInt(req.params.id)
            },
            ProjectionExpression: 'banner_text, banner_link, banner_text_color, banner_background_color',
            Select: 'SPECIFIC_ATTRIBUTES',
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

module.exports = BannerService;
