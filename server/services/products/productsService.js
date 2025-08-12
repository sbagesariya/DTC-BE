var config = require('../../../config/config');
var AWS = require("aws-sdk");

AWS.config.update(config.aws_config);
var docClient = new AWS.DynamoDB.DocumentClient();

/**
 * Class represents services for product detail.
 */
class ProductsService {

    getProducts (req, res, callback) {
        var params = {
            TableName: 'Products',
            Limit: 10,            
            ProjectionExpression: "brand_id, product_id, product_name, description, small_image, large_image"
        };
        docClient.scan(params, function(err, data) {
            if (err) {
                callback(err);
            } else {
                callback(null, data);
            }
        });
    }
}

module.exports = ProductsService;
