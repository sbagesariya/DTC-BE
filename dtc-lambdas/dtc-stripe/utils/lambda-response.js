/**
 * @name Checkout Utils
 * @author Innovify
 * This class reprasents common utilities for application
*/
class Utils {
    static errorResponse (message = 'Failed', body = {}) {
        return {
            statusCode: 200,
            body: JSON.stringify({ data: body, status: 0, message }),
            headers: {
                'Access-Control-Allow-Headers': 'Authorization, Access-Control-Allow-Headers, Origin,Accept,' +
                    'X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Api-Key',
                'Access-Control-Allow-Credentials': 'true',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE'
            }
        };
    }

    static successResponse (body = {}, message = 'Success') {
        return {
            statusCode: 200,
            body: JSON.stringify({ data: body, status: 1, message }),
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
