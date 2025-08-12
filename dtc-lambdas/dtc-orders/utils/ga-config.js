
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const Constants = require('./../utils/constants');

/**
 * @name GA Utils
 *
 * This class reprasents analytics configuration
*/
class GoogleAnalytics {
    static async connection () {
        return new BetaAnalyticsDataClient({
            keyFilename: Constants.GA_KEY_FILE_NAME
        });
    }
}

module.exports = GoogleAnalytics;
