let logLevel = process.env.LOG_LEVEL;
logLevel = ['debug', 'error', 'info', 'all'].indexOf(logLevel) > -1 ? logLevel : 'all';

/**
 * LOGGER: Debug-Info-Error
 * @name logger
 */
class Logger {
    /**
     * @desc This function is being used to get debug logs
     * @author Innovify
     * @since 17/12/2020
     */
    static debug() {
        if (['debug', 'all'].indexOf(logLevel) > -1) {
            console.log(arguments);
        }
    }

    /**
     * @desc This function is being used to get info logs
     * @author Innovify
     * @since 17/12/2020
     */
    static info() {
        if (['debug', 'info', 'all'].indexOf(logLevel) > -1) {
            console.info('Info:', arguments[0], arguments[1]);
        }
    }

    /**
     * @desc This function is being used to get error logs
     * @author Innovify
     * @since 17/12/2020
     */
    static error() {
        if (['debug', 'error', 'info', 'all'].indexOf(logLevel) > -1) {
            console.error('Error:', arguments[0], arguments[1]);
        }
    }
}

module.exports = Logger;