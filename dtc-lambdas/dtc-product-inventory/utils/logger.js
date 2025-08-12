let logLevel = process.env.LOG_LEVEL;
logLevel = ['debug', 'error', 'info', 'all'].indexOf(logLevel) > -1 ? logLevel : 'all';

/**
 * LOGGER: Debug-Info-Error
 * @name logger
 */
class Logger {
    /**
     * @desc This function is being used to get debug logs
     */
    static debug (...param) {
        if (['debug', 'all'].indexOf(logLevel) > -1) {
            console.log(param);
        }
    }

    /**
     * @desc This function is being used to get info logs
     */
    static info (...params) {
        if (['debug', 'info', 'all'].indexOf(logLevel) > -1) {
            console.info('Info:', params[0], params[1]);
        }
    }

    /**
     * @desc This function is being used to get error logs
     */
    static error (...param) {
        if (['debug', 'error', 'info', 'all'].indexOf(logLevel) > -1) {
            console.error('Error:', param[0], param[1]);
        }
    }
}
module.exports = Logger;
