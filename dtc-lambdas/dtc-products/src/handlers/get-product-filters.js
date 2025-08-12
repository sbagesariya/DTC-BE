const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const Utils = require('./../../utils/lambda-response');
const Constants = require('../../utils/constants');

/**
 * Get Filter Response
 */
exports.getProductFiltersHandler = async (event) => {
    const brandId = event.pathParameters.brandid;

    var params = {
        TableName: 'Alcohol_type',
        AttributesToGet: ['id', 'name']
    };
    const data = await docClient.scan(params).promise();
    const alcoholData = data.Items;
    var productsParams = {
        TableName: 'Products',
        KeyConditionExpression: 'brand_id = :brand_id',
        ExpressionAttributeValues: {
            ':brand_id': brandId,
            ':product_status': 0
        },
        ProjectionExpression: 'product_id',
        FilterExpression: 'product_status > :product_status'
    };
    const productData = await docClient.query(productsParams).promise();
    const productIds = productData.Items.map(obj => obj.product_id);

    const sizeParams = {
        TableName: 'Size_variants',
        ProjectionExpression: 'variant_size, variant_type',
        ExpressionAttributeValues: {}
    };
    sizeParams.FilterExpression = `product_id IN (${productIds.map((id, i) => `:product_id${i}`).join(', ')})`;
    sizeParams.ExpressionAttributeValues = Object.assign(sizeParams.ExpressionAttributeValues, productIds.reduce((obj, id, i) => {
        obj[`:product_id${i}`] = id;
        return obj;
    }, {}));
    const variantsData = await docClient.scan(sizeParams).promise();
    const productSize = variantsData.Items;

    var sizeData = [];
    productSize.forEach(item => {
        var vsize = `${item.variant_size} ${item.variant_type}`;
        if (sizeData.findIndex(p => p.id === vsize) === -1) {
            sizeData.push({
                id: vsize,
                name: vsize
            });
        }
    });
    sizeData.sort((a, b) => {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });

    const responseData = [{
        label: 'Sort by:',
        filters: [{
            key: 'sort_by',
            type: 'dropdown',
            options: Constants.PRODUCT_FILTER_SORT_BY
        }]
    },
    {
        label: 'Filter by:',
        filters: [{
            label: 'Size',
            key: 'size',
            type: 'checkbox',
            options: sizeData
        },
        {
            label: 'Type',
            key: 'type',
            type: 'checkbox',
            options: alcoholData
        }]
    }];

    // All log statements are written to CloudWatch
    return Utils.successResponse(responseData);
};
