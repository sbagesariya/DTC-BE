/**
 * @name Inventory Model
*/

var config = require('../../config/config.js');
var AWS = require('aws-sdk');

AWS.config.update(config.aws_config);
var dynamoDB = new AWS.DynamoDB();

const TableName = 'Inventory';
const indexArray = [
    {
        'primaryKey': 'retailer_id',
        'secondaryKey': 'retailer_product_id',
        'index': 'retailer_id-retailer_product_id-index'
    },
    {
        'primaryKey': 'retailer_id',
        'secondaryKey': 'sort_brand_name',
        'index': 'retailer_id-sort_brand_name-index'
    },
    {
        'primaryKey': 'brand_id',
        'index': 'brand_id-index',
        'gsi': true
    },
    {
        'primaryKey': 'product_id',
        'index': 'product_id-index',
        'gsi': true
    }
];

const updateInventoryTable = async () => {
    let result = {};
    try {
        result = await dynamoDB.describeTable({
            TableName: TableName
        }).promise();
    } catch (error) {
        result.statusCode = error.statusCode;
    }

    if (typeof result.statusCode !== 'undefined') {
        console.log('Table Does not exists!');
    } else {
        const data = result.Table.GlobalSecondaryIndexes;
        if (typeof data !== 'undefined') {
            data.forEach((item) => {
                const resultindex = indexArray.findIndex(a => a.index === item.IndexName);
                if (resultindex !== -1) {
                    indexArray.splice(resultindex, 1);
                }
            });
        }
        if (indexArray.length) {
            let count = 0;
            const setTimeInterval = setInterval(async () => {
                const tableSTatus = await dynamoDB.describeTable({
                    TableName: TableName
                }).promise();
                var isProcessing = true;
                if (tableSTatus.Table.GlobalSecondaryIndexes) {
                    tableSTatus.Table.GlobalSecondaryIndexes.forEach((value) => {
                        if (value.IndexStatus === 'CREATING') {
                            isProcessing = false;
                        }
                    });
                }
                if (isProcessing) {
                    console.log('Processing For...........', indexArray[count]);
                    await createIndex(indexArray[count]);
                    count++;
                }
                if (count === indexArray.length) {
                    console.log('SUCCESS!');
                    await clearInterval(setTimeInterval);
                } else {
                    /** Nothing to do */
                }
            }, 10000);
        } else {
            console.log('SUCCESS!');
        }
    }
};

const createIndex = async (value) => {
    const keySchema = [{
        AttributeName: value.primaryKey,
        KeyType: 'HASH'
    }];
    if (!value.gsi) {
        keySchema.push({
            AttributeName: value.secondaryKey,
            KeyType: 'RANGE'
        });
    }
    await dynamoDB.updateTable({
        AttributeDefinitions: [
            {
                AttributeName: 'retailer_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'retailer_product_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'sort_brand_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'sku_code',
                AttributeType: 'S'
            },
 	    {
                AttributeName: 'brand_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'product_id',
                AttributeType: 'S'
            }
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: value.index,
                    KeySchema: keySchema,
                    Projection: {
                        ProjectionType: 'ALL'
                    },
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 10,
                        WriteCapacityUnits: 10
                    }
                }
            }
        ],
        TableName: TableName
    })
        .promise()
        .then(() =>{})
        .catch(console.error);
};

updateInventoryTable();
