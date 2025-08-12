
const ProductService = require('./productsService');
const Utils = require('../../util/utilFunctions');

/**
 * Class represents controller for products.
 */
class ProductsController {        
    static getProducts (req, res, next) {       
        new ProductService().getProducts(req, res, (error, data) => {
            Utils.sendResponse(error, data, res, res.__('SUCCESS'));
        }, next);
    }
}

module.exports = ProductsController;
