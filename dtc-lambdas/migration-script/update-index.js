var AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-1'
});
require('./../model/update-order.model');
require('../model/update-size-variants.model');
require('../model/inventory.model');
require('../model/update-inventory.model');
require('./../model/products-indexes.model');
require('./../model/update-saved-products-indexes');
require('../model/update-fulfillment-inventory.model');
