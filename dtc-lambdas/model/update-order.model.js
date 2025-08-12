/**
 * @name Order Model
*/

var config = require('../../config/config.js');
var AWS = require('aws-sdk');

AWS.config.update(config.aws_config);
var dynamoDB = new AWS.DynamoDB();

const TableName = 'Order';
const indexArray = [
    {
        'field': 'order_id',
        'index': 'brand_id-order_id-index',
        'hash': 'brand_id'
    },
    {
        'field': 'sort_state',
        'index': 'brand_id-sort_state-index',
        'hash': 'brand_id'
    },
    {
        'field': 'sort_total',
        'index': 'brand_id-sort_total-index',
        'hash': 'brand_id'
    },
    {
        'field': 'retailer',
        'index': 'brand_id-retailer-index',
        'hash': 'brand_id'
    },
    {
        'field': 'sort_brand_name',
        'index': 'retailer_id-sort_brand_name-index',
        'hash': 'retailer_id'
    },
    {
        'field': 'estimated_delivery_date',
        'index': 'retailer_id-estimated_delivery_date-index',
        'hash': 'retailer_id'
    },
    {
        'field': 'order_id',
        'index': 'retailer_id-order_id-index',
        'hash': 'retailer_id'
    },
    {
        'field': 'sort_total',
        'index': 'retailer_id-sort_total-index',
        'hash': 'retailer_id'
    },
    {
        'field': 'createdAt',
        'index': 'retailer_id-createdAt-index',
        'hash': 'retailer_id'
    },
    {
        'hash': 'po_number',
        'index': 'po_number-index',
        'gsi': true
    },
    {
        'hash': 'order_id',
        'index': 'order_id-index',
        'gsi': true
    },
    {
        'hash': 'user_email',
        'index': 'user_email-index',
        'gsi': true
    },
    {
        'hash': 'retailer_id',
        'index': 'retailer_id-index',
        'gsi': true
    }
];

const updateOrderTable = async () => {
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
            const setTimeInterval = setInterval(async ()=> {
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
        AttributeName: value.hash,
        KeyType: 'HASH'
    }];
    if (!value.gsi) {
        keySchema.push({
            AttributeName: value.field,
            KeyType: 'RANGE'
        });
    }
    await dynamoDB.updateTable({
        AttributeDefinitions: [
            {
                AttributeName: 'order_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'brand_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'retailer_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'order_status',
                AttributeType: 'S'
            },
            {
                AttributeName: 'createdAt',
                AttributeType: 'N'
            },
            {
                AttributeName: 'sort_state',
                AttributeType: 'S'
            },
            {
                AttributeName: 'sort_total',
                AttributeType: 'N'
            },
            {
                AttributeName: 'retailer',
                AttributeType: 'S'
            },
            {
                AttributeName: 'sort_brand_name',
                AttributeType: 'S'
            },
            {
                AttributeName: 'po_number',
                AttributeType: 'S'
            },
            {
                AttributeName: 'user_email',
                AttributeType: 'S'
            },
            {
                AttributeName: 'estimated_delivery_date',
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
        .then(data =>{})
        .catch(console.error);
};

updateOrderTable();
