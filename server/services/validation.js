/**
 * Created by Innovify on 04/06/2020
 * @name signUpValidator
 */
class Validator {
    /**
     * @desc This function is being used to validate email address
     * @author Innovify
     * @since 08/01/2020
     * @param {string} email Email
     */
    async email (email) {
        if (!email || !CONSTANTS.REGEX.EMAIL.test(email)) {
            throw {
                message: MESSAGES.INVALID_REQUEST,
                statusCode: 400
            };
        }
    }

    /**
     * @desc This function is being used to signUp user
     * @author Innovify
     * @since 08/01/2020
     * @param {string} password Password
     */
    async password (password) {
        if ((!password || password.length !== 64)) {
            throw {
                message: MESSAGES.INVALID_REQUEST,
                statusCode: 400
            };
        }
    }

    /**
     * @desc This function is being used to validate OTP input
     * @param {number} otp OTP number
     * @author Innovify
     * @since 27/05/2020
     */
    async otp (otp) {
        if (!otp || otp.toString().length !== CONSTANTS.OTPLENGTH) {
            throw {
                message: MESSAGES.INVALID_REQUEST,
                statusCode: 400
            };
        }
    }
}

module.exports = Validator;
