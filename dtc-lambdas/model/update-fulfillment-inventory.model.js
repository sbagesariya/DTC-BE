/**
 * @name SizeVariants Model
*/

var config = require('../../config/config.js');
var AWS = require('aws-sdk');
const indexArray = [
    {
        'primaryKey': 'brand_id',
        'index': 'brand_id-index',
        'gsi': true
    },
    {
        'primaryKey': 'sku_code',
        'index': 'sku_code-index',
        'gsi': true
    }
];
AWS.config.update(config.aws_config);
var dynamoDB = new AWS.DynamoDB();
const tableName = 'Fulfillment_inventory';
const updateFullfillmentInventoryTable = async () => {
    let result = {};
    try {
        result = await dynamoDB.describeTable({
            TableName: tableName
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
            const setTimeInterval = setInterval(async ()=> {
                const tableSTatus = await dynamoDB.describeTable({
                    TableName: tableName
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
                AttributeName: 'brand_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'sku_code',
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
        TableName: tableName
    })
        .promise()
        .then(() =>{})
        .catch(console.error);
};

updateFullfillmentInventoryTable();
