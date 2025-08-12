const { Client } = require('@elastic/elasticsearch');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM();

/**
 * @name ES Utils
 *
 * This class reprasents elastic configuration
*/
class ElasticSearch {
    static async connection () {
        const params = {
            Name: 'es_config',
            WithDecryption: true
        };
        const key = await ssm.getParameter(params).promise();
        var es = key.Parameter.Value.split(',');
        return new Client({
            node: es[0],
            auth: {
                username: es[1],
                password: es[2]
            }
        });
    }

}

module.exports = ElasticSearch;
