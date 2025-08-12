const swaggerUi = require('swagger-ui-express');
let swaggerJson = require('../public/swagger.json');

// Products
swaggerJson = require('../services/products/productsSwagger')(swaggerJson);
swaggerJson = require('../services/banner/bannerSwagger')(swaggerJson);
swaggerJson = require('../services/brand/brandSwagger')(swaggerJson);

const baseURL = process.env.BASE_URL.split('://');
swaggerJson.host = baseURL[1];
swaggerJson.info.description = `HostName / URL : ${swaggerJson.host}`;
swaggerJson.schemes[0] = baseURL[0];

module.exports = function (router) {
    router.get('/swagger', (req, res) => {
        res.json(swaggerJson);
    });
    router.use('/api-docs', swaggerUi.serve);
    router.get('/api-docs', swaggerUi.setup(swaggerJson));
};
