var router      = require('express').Router();          // router instance
var passport    = require('passport');                  // "passport" package
var mongoose    = require('mongoose');                  // "mongoose" package
var User        = mongoose.model('User');               // user database model
var tokenAuth   = require('../middlewares/token');      // "tokenAuth" middleware for generating JWT's
var validation  = require('../middlewares/validation/validation.js'); // custom validation fields
var config      = require('../config/config');          // basic configurations
var nodemailer  = require('nodemailer');                // "nodemailer" package for sending emails
var HttpStatus  = require('http-status-codes');         // "http-status-code" package for HTTP Status Codes

/**
 * HTTP Method: POST
 * Example URL: http://localhost:8080/auth/signin
 * Authenticates the user and returns a JWT if user was found in the database
 */
router.post('/signin', function(req, res) {

    // validate input fields sent in request body object
    req.checkBody(validation.login);
    req.getValidationResult().then(function(result) {
        // if any validation errors were found, print them in json
        if (!result.isEmpty()) {
            return res.status(HttpStatus.BAD_REQUEST).json(result.mapped());
        }

        // try authenticate user with given credentials
        passport.authenticate('local', function (err, user, info) {
            // If Passport throws/catches an error
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST).json(err);
            }
            // incorrect credentials
            if(!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json(info);
            }
            // user not activated
            if(user.active !== true) {
                return res.status(HttpStatus.UNAUTHORIZED).json({error: true, message: "Unverified account"});
            }
            // generate a token for the user
            var token = tokenAuth.generateJwt();
            // return the token as json
            res.status(HttpStatus.OK).json({"error": false, "message": null, data: {"token": token}});
        })(req, res);
    });
});

/**
 * HTTP Method: GET
 * Example URL: http://localhost:8080/auth/activate/wJHKiUtPNfcbBLXiWng6Cl8VSVhyitMf
 * Activates the user based on the authentication token found in the route parameter
 * Note: Users are not able to login before verifying their account
 */
router.get('/activate/:activation_token', function(req, res) {
    // set the content type to json
    res.contentType('application/json');
    var activation_token = req.params.activation_token;

    // fetch user data based on activation token
    User.findOne({ activation_token: activation_token }, function (err, foundUser) {
        // if any errors with the database
        if (err) {
            // console.log(err);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
        }
        // if user was not found in the database
        if(!foundUser || foundUser.activation_token !== req.params.activation_token) {
            return res.status(HttpStatus.NOT_FOUND).json({error: true, message: "Invalid activation token"});
        }
        // if token found in the route params matches the token found in the database
        foundUser.activation_token = null;
        foundUser.active = true;

        // update the 'activation_token' and 'active' fields
        foundUser.save(function(err, updatedObject) {
            if(err) {
                // console.log(err);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).send();
            } else {
                // console.log(updatedObject); outputs the updated user info
                res.status(HttpStatus.OK).json({error: false, message: "User activated. You may now log in."});
            }
        });
    });
});

/**
 * HTTP Method: POST
 * Example URL: http://localhost:8080/auth/signup
 * Creates a new user, generates an activation link that will be sent to the given e-mail address
 */
router.post('/signup', function(req, res) {

    // validate input fields sent in request body object
    // TODO: Create a filter or a middlware to check if email already exists in the database
    req.checkBody(validation.register);
    req.getValidationResult().then(function(result) {
        // if any validation errors were found, print them in json
        if (!result.isEmpty()) {
            return res.status(HttpStatus.BAD_REQUEST).json(result.mapped());
        }
        var user = new User();
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;

        user.save(function (err, user) {
            if (err) {
                throw err;
                // TODO Email templating and perhaps use a middleware instead of generic way to create and email
            } else {
                // create reusable transporter object using the default SMTP transport
                var transporter = nodemailer.createTransport(config.nodemailer.connection);

                var sendActivationEmail = transporter.templateSender({
                    subject: 'Thank you for signin up! Verify your account',
                    html: '<b>Hello, <strong>{{name}}</strong><br> Your activation link is:\n<b>{{ activation_link }}</b></p>'
                }, {
                    from: 'tatu.kulm@gmail.com'
                });

                sendActivationEmail({
                    to: user.email
                }, {
                    name: user.name,
                    activation_link: process.env.BASE_URL + '/auth/activate/' + user.activation_token
                }, function (err, info) {
                    if (err) {
                        return console.log(err);
                    }
                    res.status(HttpStatus.CREATED).json({
                        error: false,
                        message: "Signup completed. Verify your account by following the instructions sent in your email"
                    });
                });
            }
        });
    });
});

module.exports = router;
