const BrandService = require('./brandService');
const Utils = require('../../util/utilFunctions');

/**
 * Class represents controller for brands.
 */
class BrandController {
    static getBrandDetails (req, res, next) {
        new BrandService().getBrandDetails(req, res, (error, data) => {
            Utils.sendResponse(error, data, res, res.__('SUCCESS'));
        }, next);
    }
}

module.exports = BrandController;
