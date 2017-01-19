var passport        = require('passport');                  // "passport" package
var LocalStrategy   = require('passport-local').Strategy;   // "passport-strategy"
var mongoose        = require('mongoose');                  // mongoose package for database queries
var User            = mongoose.model('User');               // user database model

passport.use(new LocalStrategy({
        usernameField: 'email' // define custom username field (we'll be using email instead of username)
    },
    /**
     * function to check whether the given credentials match with credentials found in the database
     * @param username
     * @param password
     * @param done
     */
    function(username, password, done) {
        // find user from the database by email value
        User.findOne({ email: username }, function (err, user) {
            // if any errors during finding, done errors
            if (err) { return done(err); }

            // if user was not found in the database, done
            if(!user) { return done(null, false, {error: true, message: "Incorrect credentials"}); }

            // compare the given password to a hashed password stored in the database
            user.comparePassword(password, function(err, isValid) {
                // if any error during the comparison
                if(err) { return done(null, false); }
                // if passwords didn't match
                else if(!isValid) { return done(null, false, {error: true, message: "Incorrect credentials"}); }

                // otherwise, pass the user object forward to the "signin" route
                else { return done(null, user); }
            });

        });
    }
));