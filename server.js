require('dotenv').config();                             // "dotenv" package for environment variables
var morgan              = require('morgan');            // "morgan" package for logging requests
var bodyParser          = require('body-parser');       // "body-parser" package for POST request handling
var passport            = require('passport');          // "passport" package for authentication handling
var expressJWT          = require('express-jwt');       // "express" package for json web tokens
var mongoose            = require('mongoose');          // "mongoose" package for MongoDB
var helmet              = require('helmet');            // set security-related HTTP headers with "helmet" package
var expressValidator    = require('express-validator'); // "express-validator" package for validating request body objects
var express             = require('express');           // "express" package
var app                 = express();                    // initialize express

// use 'dist' folder if node environment is set to 'development', otherwise use 'src' folder
(process.env.NODE_ENV === 'development') ? folder_dest = 'dist' : folder_dest = 'src';

// require basic configuration file
var config = require('./backend/' + folder_dest + '/config/config');

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
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
app.use(bodyParser.urlencoded({ extended: true })); // returns middleware that only parses urlencoded bodies.
app.use(bodyParser.json()); // returns middleware that only parses json.

// An express.js middleware for node-validator.
app.use(expressValidator()); // this line must be immediately after any of the bodyParser middlewares!

/**
 * **********************************************************************
 * Security, logging and serving static files
 * **********************************************************************
 */

// Helmet can help protect your app from some well-known web vulnerabilities by setting HTTP headers appropriately.
// Helmet is actually just a collection of nine smaller middleware functions that set security-related HTTP headers.
// referenced at: https://expressjs.com/en/advanced/best-practice-security.html
app.use(helmet());

// HTTP request logger middleware for node.js
app.use(morgan('dev'));

// To serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
// Pass the name of the directory that contains the static assets to the express.static middleware function to start serving the files directly.
// referenced at: https://expressjs.com/en/starter/static-files.html
app.use('/static', express.static(__dirname + '/public')); // assigning app-wide cache settings

/**
 * *********************************************************************
 *  Auth routes
 * **********************************************************************
 */
var authRoutes  = require('./backend/' + folder_dest +'/routes/auth');
// initialize passport middleware
app.use(passport.initialize());

// assign the '/auth/' prefix to authentication routes
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
 * **********************************************************************
 * Serve frontend routes s
 * **********************************************************************
 */
// use this only if you are developing an SPA (single page application)
app.get('*', function(req, res) {
    res.sendFile("public/views/index.html", {"root": __dirname});
});

/**
 * *********************************************************************
 *  Start the server / application
 * **********************************************************************
 */
var port = process.env.PORT || 8080; // set our port
app.listen(port); // start listening the port
console.log('Server running on port ' + port); // notify via console that the server has started

// Changed OS from Windows to Linux
// This is a commit test


