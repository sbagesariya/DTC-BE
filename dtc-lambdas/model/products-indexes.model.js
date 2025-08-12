/**
 * @name Products Model
*/

var config = require('../../config/config.js');
var AWS = require('aws-sdk');

const TableName = 'Products';

const indexArray = [
    {
        'field': 'product_name',
        'index': 'brand_id-product_name-index'
    },
    {
        'field': 'price',
        'index': 'brand_id-price-index'
    },
    {
        'field': 'featured',
        'index': 'brand_id-featured-index'
    },
    {
        'field': 'availability_count',
        'index': 'brand_id-availability_count-index'
    },
    {
        'field': 'variants_count',
        'index': 'brand_id-variants_count-index'
    },
    {
        'field': 'order_n',
        'index': 'brand_id-order_n-index'
    }
];

AWS.config.update(config.aws_config);
var dynamoDB = new AWS.DynamoDB();

const createProductTableIndexes = async () => {
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
                }
            }, 10000);
        } else {
            console.log('SUCCESS!');
        }
    }
};

createProductTableIndexes();

const createIndex = async (value) => {
    await dynamoDB.updateTable({
        AttributeDefinitions: [
            {
                AttributeName: 'brand_id',
                AttributeType: 'S'
            },
            {
                AttributeName: 'product_name',
                AttributeType: 'S'
            },
            {
                AttributeName: 'price',
                AttributeType: 'N'
            },
            {
                AttributeName: 'featured',
                AttributeType: 'S'
            },
            {
                AttributeName: 'availability_count',
                AttributeType: 'N'
            },
            {
                AttributeName: 'variants_count',
                AttributeType: 'N'
            },
            {
                AttributeName: 'order_n',
                AttributeType: 'N'
            }
        ],
        GlobalSecondaryIndexUpdates: [
            {
                Create: {
                    IndexName: value.index,
                    KeySchema: [
                        {
                            AttributeName: 'brand_id',
                            KeyType: 'HASH'
                        },
                        {
                            AttributeName: value.field,
                            KeyType: 'RANGE'
                        }
                    ],
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
