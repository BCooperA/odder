var mongoose            = require('mongoose'),
    Schema              = mongoose.Schema,
    randtoken           = require('rand-token'),
    SALT_WORK_FACTOR    = 10;

var bcrypt  = require('bcryptjs');

/**
 * Database Schema for user
 * @type {Schema}
 */
var userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        default: false
    },
    activation_token: {
        type: String
    }
});


/**
 * Hash the password before inserting it to the database with blowfish crypt
 */
userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });

    user.activation_token = randtoken.generate(32);
});

/**
 * Compare given password to a hash found in the database
 * @param candidatePassword
 * @param cb
 */
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    var user = this;

    bcrypt.compare(candidatePassword, user.password, function(err, isMatch) {
        // Prevent conflict btween err and isMatch
        if (err) return cb(err, null);
            cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
