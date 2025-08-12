const Utils = require('../../utils/lambda-response');
const Logger = require('../../utils/logger');

'use strict';

const { Client } = require('@elastic/elasticsearch');
const client = new Client({
    node: 'https://search-parkstreet-ekiddhxm5ugwvpctyrivimtmvi.us-east-1.es.amazonaws.com'
    // auth: {
    //     username: 'dev-dtc',
    //     password: '6F1L37^vixRMs*'
    // }
});

class getDataFromES {

    async getESData (req, context, callback) {
        try {
            const { body } = await client.search({
                index: 'inventory-index',
                body: {
                    _source: [
                        'product_name',
                        'select',
                        'alcohol_type',
                        'retailer_id',
                        'brand_name',
                        'unit_price',
                        'brand_id',
                        'createdAt',
                        'product_id',
                        'upc_code',
                        'retailer_product_id',
                        'stock',
                        'updatedAt'
                    ],
                    query: {
                        bool:
                        {
                            must:
                            [
                                {
                                    match: { 'brand_id': 'a12801b4-51ef-48de-b3d9-047eec4dde51' }
                                },
                                { range: { 'stock': { gt: 0 } } }
                            ]
                        }
                    }, from: 0, size: 10,
                    collapse: {
                        field: 'product_id.keyword',
                        inner_hits: {
                            name: 'most_recent',
                            size: 5
                        }
                    },
                    sort: [
                        { 'product_id.keyword': { 'order': 'asc' } }
                    ]
                }

            });

            const inventory = [];
            let variants = [];
            body.hits.hits.map(products => {
                variants = [];
                products.inner_hits.most_recent.hits.hits.map(variant => {
                    variants.push({
                        size: variant._source.size,
                        price: variant._source.price
                    });
                });
                const prepareProducts = products._source;
                prepareProducts.matrix = variants;
                inventory.push(prepareProducts);
            });

            const totalRecords = body.hits.total.value;

            return callback(null, Utils.successResponse( { 'data': inventory, 'total_records': totalRecords }, 'Success!'));
        } catch (error) {
            Logger.error('addSearchFieldData:catch', error);
            return Utils.errorResponse(error);
        }
    }
}
module.exports.getDataFromESHandler = async (event, context, callback) =>
    new getDataFromES().getESData(event, context, callback);
