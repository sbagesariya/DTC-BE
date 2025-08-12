module.exports = {
    LOG_LEVEL: 'debug',
    AWS_REGION: 'eu-west-1',
    REGEX: {
        EMAIL: /^[A-Za-z0-9](\.?[A-Za-z0-9_-]){0,}@[A-Za-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/,
        FIRSTNAME: /^[a-zA-Z0-9,'~._^ -]*$/,
        SURNAME: /^[a-zA-Z0-9,'~._^ -]*$/,
        ALPHA_ONLY: /^[a-zA-Z']*$/,
        ALPHA_SPECIAL_CHAR: /^[ A-Za-z0-9_@./#&+-]*$/,
        ALPHA_SPECIAL_CHAR_EXCEPT_NUMBER: /^[ A-Za-z_@./#&+-]*$/,
        FULL_ACCESS: /^[^<> ?//\\]+$/,
        ALPHA_NUMARIC: /^[\w@ ]+$/,        
        URL: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%+.~#?&//=]*)/
    }
};
