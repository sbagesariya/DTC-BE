
const fs = require('fs');
const parse = require('csv-parse');
const async = require('async');
const AWS = require('aws-sdk');
const db = require('dynamoose');
// const Model = require('../model/products-addresses.model');
const Model = require('../model/order.model');
db.aws.sdk.config.update({
    region: 'us-east-1'
});
if (process.env.NODE_ENV === 'local') {
    db.aws.ddb.local('http://localhost:8000');
}

// var csv_filename = './migration-script/Products_addresses.csv';
var csv_filename = './migration-script/Order.csv';
rs = fs.createReadStream(csv_filename);
parser = parse({
    columns: true,
    delimiter: ','
}, (err, data) => {
    var split_arrays = []; var size = 25;
    while (data.length > 0) {
        split_arrays.push(data.splice(0, size));
    }
    async.each(split_arrays, async (item_data, callback) => {
        const data = [];
        try {
            item_data.map((item, index) => {
                const obj = {};
                for (key of Object.keys(item)) {
                    let newKey;
                    let newVal;
                    if (key.indexOf('(S)') >= 0) {
                        newKey = key.slice(0, -4);
                        newVal = String(item[key]);
                    } else if (key.indexOf('(N)') >= 0) {
                        newKey = key.slice(0, -4);
                        newVal = Number(item[key]);
                    } else if (key.indexOf('(M)') >= 0) {
                        newKey = key.slice(0, -4);
                        newVal = {};
                        const subObj = JSON.parse(item[key]);
                        for (k of Object.keys(subObj)) {
                            if (subObj[k].S) {
                                newVal[k] = String(subObj[k].S);
                            } else if (subObj[k].N) {
                                newVal[k] = Number(subObj[k].N);
                            }
                        }
                    } else if (key.indexOf('(L)') >= 0) { // product_detail(L)
                        var arrayKey = key.slice(0, -4); // product_detail
                        const arrayKeySubObj = JSON.parse(item[key]);
                        newKey = arrayKey;
                        newVal = [];
                        for (const objectK of Object.keys(arrayKeySubObj)) {
                            var subValue = {};
                            if (arrayKeySubObj[objectK].M) { // (M)
                                var subObj = arrayKeySubObj[objectK].M;
                                for (k of Object.keys(subObj)) {
                                    if (subObj[k].S) {
                                        subValue[k] = String(subObj[k].S);
                                    } else if (subObj[k].N) {
                                        subValue[k] = Number(subObj[k].N);
                                    }
                                }
                            }
                            newVal.push(subValue);
                        }
                    }

                    obj[newKey] = newVal;
                }
                obj.createdAt = new Date().getTime() + index;
                console.log('obj---', obj);
                data.push(obj);
            });
            await Model.batchPut(data);
        } catch (error) {
            console.log('Error..............', error);
        }
    }, () => {
        console.log('All Data Imported....');
    });

});
rs.pipe(parser);
