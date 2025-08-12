/**
 * @name TP-apis Utils
 * @author Innovify
 * This class reprasents common utilities for application
*/
class Utils {
    static errorResponse (msg = 'Failed', body = {}, statusCode = 200) {
        return {
            statusCode,
            body: JSON.stringify({ data: body, haserror: 1, msg }),
            headers: {
                'Access-Control-Allow-Headers': 'Authorization, Access-Control-Allow-Headers, Origin,Accept,' +
                    'X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Api-Key',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE'
            }
        };
    }

    static successResponse (body = {}, msg = 'Success') {
        return {
            statusCode: 200,
            body: JSON.stringify({ data: body, haserror: 0, msg }),
            headers: {
                'Access-Control-Allow-Headers': 'Authorization, Access-Control-Allow-Headers, Origin,Accept,' +
                    'X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Api-Key',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE'
            }
        };
    }
}

module.exports = Utils;
