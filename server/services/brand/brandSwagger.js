const message = require('../../locales/en');

module.exports = swaggerJson => {
    swaggerJson.paths['/brand/{id}'] = {
        'get': {
            'tags': [
                'Brand'
            ],
            'description': 'Get Brand Details',
            'summary': 'Get Brand Details',
            'parameters': [
                {
                    'in': 'path',
                    'name': 'id',
                    'description': 'Template ID',
                    'required': true,
                    'type': 'integer'
                }
            ],
            'responses': {
                '200': {
                    'description': 'Professional details get',
                    'schema': {
                        '$ref': '#/definitions/success'
                    }
                },
                '400': {
                    'description': 'Invalid request',
                    'schema': {
                        '$ref': '#/definitions/validationError'
                    }
                },
                '401': {
                    'description': 'Unauthorized Access',
                    'schema': {
                        '$ref': '#/definitions/unauthorisedAccess'
                    }
                },
                '500': {
                    'description': 'Something went wrong. Try again.',
                    'schema': {
                        '$ref': '#/definitions/unexpextedError'
                    }
                }
            }
        }
    };

    

    swaggerJson.definitions.unexpextedError = {
        'properties': {
            'status': {
                'type': 'number',
                'example': 0
            },
            'message': {
                'example': message.ERROR_MSG
            }
        }
    };

    swaggerJson.definitions.validationError = {
        properties: {
            status: {
                type: 'number',
                example: 0
            },
            message: {
                example: message.INVALID_REQUEST
            }
        }
    };

    swaggerJson.definitions.unauthorisedAccess = {
        properties: {
            status: {
                type: 'number',
                example: 0
            },
            message: {
                example: message.ACCESS_DENIED
            }
        }
    };

    swaggerJson.definitions.success = {
        'type': 'object',
        'properties': {
            'status': {
                'type': 'boolean',
                'example': true
            },
            'message': {
                'example': message.SUCCESS
            }
        }
    };
    return swaggerJson;
};
