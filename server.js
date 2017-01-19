require('dotenv').config();                             // "dotenv" package for environment variables
var morgan              = require('morgan');            // "morgan" package for logging requests
var bodyParser          = require('body-parser');       // "body-parser" package for POST request handling
var passport            = require('passport');          // "passport" package for authentication handling
var expressJWT          = require('express-jwt');       // "express" package for json web tokens
var mongoose            = require('mongoose');          // "mongoose" package for MongoDB
var express             = require('express');           // "express" package
var expressValidator    = require('express-validator');
var mailer              = require('express-mailer');
var app                 = express();                    // initialize express

(process.env.NODE_ENV === 'development') ? folder_dest = 'dist' : folder_dest = 'src';
var config = require('./backend/' + folder_dest + '/config/config'); // basic configuration file

/**
 * **********************************************************************
 * Database Models
 * **********************************************************************
 */
var User = require('./backend/' + folder_dest + '/models/user');
require('./backend/' + folder_dest + '/config/passport'); // require passport strategy

/**
 * **********************************************************************
 * Database connection
 * **********************************************************************
 */
mongoose.Promise = global.Promise; // Mongooses own 'mpromise' library is deprecated, instead use own Promise library

// Connect to a database
mongoose.connect(config.mongodb.url, function(err,database) {
    var db, port;

    if (err)
        return console.log(err);
    else
        db = database;
        port = process.env.dbPort || 3000; // use port 3000 if port not declared in .env file
        app.listen(port); // start listening the port
        console.log('Database is running on port ' + port);
});

/**
 * *********************************************************************
 *  JWT Middlewares
 * **********************************************************************
 */
var jwtAuth = require('./backend/' + folder_dest + '/middlewares/token'); // JWTAuthentication

// Json Web Tokens for authenticating users and protecting the API
var jwt = expressJWT({secret: config.token.secret}).unless({path: [{ url: '/' }]});

/**
 * *********************************************************************
 *  Configuration
 * **********************************************************************
 */
// BodyParser for able to manipulate request bodies
app.use(bodyParser.urlencoded({ extended: true })); //bodyParser configuration
app.use(bodyParser.json()); // format bodyParser to JSON
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

// Miscellaneous
app.use(morgan('dev')); // use morgan to log HTTP requests to the console
app.use('/static', express.static(__dirname + '/public')); // assigning app-wide cache settings

mailer.extend(app, {
    from: 'no-reply@example.com',
    host: process.env.MAIL_HOSTNAME, // hostname
    secureConnection: true, // use SSL
    port: process.env.MAIL_PORT, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

/**
 * *********************************************************************
 *  Auth routes
 * **********************************************************************
 */
var authRoutes  = require('./backend/' + folder_dest +'/routes/auth');
// initialize passport middleware
app.use(passport.initialize());
app.use('/auth/', authRoutes);

/**
 * ********************************************************************
 *  Base URL for API endpoint
 * *********************************************************************
 */
app.get('/api/', function(req, res) {
    res.send('API endpoint is at http://localhost:' + port + '/api/' + config.api.version);
});

/**
 * *********************************************************************
 *  API routes
 * **********************************************************************
 */
var teams      = require('./backend/' + folder_dest +'/routes/teams'); // team-based routes
var schedule   = require('./backend/' + folder_dest + '/routes/schedule'); // schedule-based routes
var testRoutes = require('./backend/' + folder_dest + '/routes/testRoutes'); // schedule-based routes
var apiRoutes  = [teams, schedule, testRoutes]; // declare all the routes under the '/api/{version}' in here

// assign the '/api/{version}' prefix to routes and protect API routes by providing an authentication middleware
app.use('/api/' + config.api.version, apiRoutes);
//app.use('/api/' + config.api.version, [jwt, jwtAuth.sendRefreshedTokenInResponseHeaders], apiRoutes); // USE IN PRODUCTION


/**
 * **********************************************************************
 * Custom Error Handlers
 * **********************************************************************
 */
// Catch unauthorised errors
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401);
        res.json({"error": true, "message": err.message});
    }
});

/**
 * Frontend routes
 *
 */
app.get('*', function(req, res) {
    res.sendFile("public/views/index.html", {"root": __dirname}); // load the single view file (angular will handle the page changes on the front-end)
});

/**
 * *********************************************************************
 *  Start the server / application
 * **********************************************************************
 */
var port = process.env.PORT || 8080; // set our port
app.listen(port); // start listening the port
console.log('Server running on port ' + port); // notify via console that the server has started




