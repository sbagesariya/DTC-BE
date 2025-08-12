
const BannerService = require('./bannerService');
const Utils = require('../../util/utilFunctions');

/**
 * Class represents controller for banner.
 */
class BannerController {        
    static getBannerDetails (req, res, next) {       
        new BannerService().getBannerDetails(req, res, (error, data) => {
            Utils.sendResponse(error, data, res, res.__('SUCCESS'));
        }, next);
    }
}

module.exports = BannerController;
