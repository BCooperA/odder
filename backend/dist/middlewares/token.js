var jwt     = require('jsonwebtoken');      // Json Web Token (JWT) package for creating, sign and verify auth tokens
var moment  = require('moment');            // "moment" package for time and date
var config  = require('../config/config');  // basic configuration file

var tokenAuth = {

    /**
     * Generates a JSON Web Token for the user
     * @returns {*}
     */
    generateJwt:function(user) {
        return jwt.sign({
            user: user,
            exp: config.token.expires
        }, config.token.secret);
    },
    /**
     * Generates a new JSON Web token, signs it with payload data and returns it
     * @param user
     * @returns {*}
     */
    generateRefreshJwt: function(user) {
        return jwt.sign({
            exp: Math.floor(Date.now() / 1000) + (60 * 15), // extend the "exp" by 15min
            user: user
        }, config.token.secret);

    },

    /**
     * Decodes the Json Web Token (JWT) and compares its expiration value to expiration value set on the config file
     * If token is expired, re-sets the expiration value of payload and returns new token
     * @param decoded
     * @returns {*}
     */
    isExpired: function (decoded) {
        var token_exp, now, newToken;

        token_exp = decoded.exp; // get the expiration value out of the decoded payload of the token
        now = moment().unix().valueOf(); // get timestamp of current time

        if ((token_exp - now) < config.token.expires) { // if token is not expired

            newToken = tokenAuth.generateRefreshJwt(decoded.user); // generate a new token

            if (newToken) { // if token was generated without errors, return it
                return newToken;
            }
        } else {
            return decoded;
        }
    },

    /**
     * Middleware function to check whether token needs to be refreshed or not
     * First, extracts the token from "Authorization" header, removes "Bearer" part of it and verifies it
     * If token was verified, send the newly generated token as a response header
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    sendRefreshedTokenInResponseHeaders: function (req, res, next) {
        var newToken;
        var authorizationHeader = req.headers.authorization; // "Authorization Bearer + JWT"
        var token = authorizationHeader.split(" ")[1]; // "JWT"

        if (token) { // if token was provided, decode it

            // verify the token with the data
            jwt.verify(token, process.env.TOKEN_SECRET, function (err, decoded) {
                if (err) {
                    // token could not be verified
                    return res.status(401).json({"error": true, "message": "Failed to authenticate the access token"});
                } else {

                    // check whether token needs refreshing or not
                    newToken = tokenAuth.isExpired(decoded);

                    // if token was expired, return generated token in "Authorization" header
                    if (newToken) {
                        res.set('Authorization', 'Bearer ' + newToken);
                        next();

                        // if token was not expired, return current token in "Authorization" header
                    } else {
                        res.set('Authorization', 'Bearer ' + token);
                        next();
                    }
                }
            });

            // if token was not provided at all, return an error
        } else {
            return res.status(401).send({"error": true, "message": "Access token was not provided"});
        }
    }
};
module.exports = tokenAuth;
