/**
 * Basic configuration settings
 * @type {{api: {version: *}, mongodb: {url: string}, token: {secret: *, expires: number}, xray: {filters: {trim: Function, reverse: Function, slice: Function, toUpperCase: Function, static: Function, symbolSubstract: Function, abbToFullName: Function, replaceAbbs: Function, isResult: Function, capitalizeString: Function}}}}
 */
module.exports = {
    // API config
    api: {
      version: process.env.API_VERSION
    },
    // mongo db config
    mongodb: {
        url: process.env.REMOTE_MONGO_URL
    },

    // jwt (json web token) config
    token: {
        'secret': process.env.TOKEN_SECRET,
        'expires': Math.floor(Date.now() / 1000) + (60 * 15) // Set the token expire time to 15min
    },
    // nodemailer config
    nodemailer: {
        connection: {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            logger: true
        }

    },
    // xray package config
    xray: {
        filters: {
            trim: function (value) {
                return typeof value === 'string' ? value.trim() : value
            },
            reverse: function (value) {
                return typeof value === 'string' ? value.split('').reverse().join('') : value
            },
            slice: function (value, start, end) {
                return typeof value === 'string' ? value.slice(start, end) : value
            },
            toUpperCase: function (value) {
                return typeof value === 'string' ? value.toUpperCase() : value
            },
            static: function (value, svalue) {
                return svalue || value;
            },
            symbolSubstract: function (value, start, symbol) {

                return typeof value === 'string' ? value.substr(start, status.indexOf(symbol.toString())).replace(/\s/g, '') : value;
            },
            isResult: function (value) {
                return value != '' ? value.replace(/[\r\n\s]/g, '') : null;
            },
            capitalizeString: function(value) {
                return typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value;
            }
        }
    }
};