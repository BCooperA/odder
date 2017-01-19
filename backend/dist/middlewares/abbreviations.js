var teams = require('../static').teams; // Include the team data object from another file
var StatsApiIds = require('../static').StatsApiIds; // Include team ID's
var dailyFaceoffIds = require('../static').dailyFaceoffIds; // Include ID's from thedailyfaceoff.com
var rotoWorldAbbs = require('../static').rotoWorldAbbs; // Include ID's from thedailyfaceoff.com
var HttpStatus = require('http-status-codes');

module.exports = {

    /**
     * Replaces the team abbreviations with respective ID numbers found on the static.js file (DailyFaceOff)
     * @param req
     * @param res
     * @param next
     */
    abbsToDFIds: function(req, res, next) { // DF = Daily Faceoff (url for starting goalies and lines data)

        for (var key in dailyFaceoffIds) {
            if(dailyFaceoffIds.hasOwnProperty(key))
                if (key.toLowerCase() == req.params.team.toLowerCase()) { // compare key to route parameter
                    // Return the id as a new req.params object
                    req.params.id = dailyFaceoffIds[key];
                }
        }
        next(); // pass changes forward
    },

    /**
     * Replaces the team abbreviations with respective ID numbers found on the static.js file (StatsApi)
     * @param req
     * @param res
     * @param next
     */
    abbsToStatsAPIIds: function(req, res, next) {
        for (var key in StatsApiIds) {
            if(StatsApiIds.hasOwnProperty(key))
                if (key.toLowerCase() == req.params.team.toLowerCase()) { // compare key to route parameter
                    // Return the id as a new req.params object
                    req.params.id = StatsApiIds[key];
                }
        }
        next(); // pass changes forward
    },

    /**
     * Replaces the team abbreviation inputted in route parameters and returns the corresponding RotoWorld Abbreviation
     * @param req
     * @param res
     * @param next
     */
    abbsToRPKeys: function(req, res, next) { // RT = RotoWorld (url for inury data)
        for (var key in rotoWorldAbbs) {
            if(rotoWorldAbbs.hasOwnProperty(key))
                if (key.toLowerCase() == req.params.team.toLowerCase()) { // compare key to route parameter
                    req.params.rotoAbb = rotoWorldAbbs[key]; // "ari", "mon", "nas"
                }
        }
        next();
    },

    abbToSlug: function(req, res, next) {
        for(var key in teams) {
            if(teams.hasOwnProperty(key))
            if(key.toLowerCase() == req.params.team.toLowerCase()) {
                req.params.slug = teams[key].replace(/\s+/g, '-').toLowerCase(); // "montreal-canadiens", "nashville-predators"
            }
        }
        next();
    },

    /**
     * Middleware to check whether the abbreviation of team in the route parameter is found in the "teams" object
     * @param req
     * @param res
     * @param next
     */
    isValidAbb: function(req, res, next) {
        if(teams.hasOwnProperty(req.params.team)) {
            next();
        } else {
            return res.status(HttpStatus.NOT_FOUND).json({error: true, "message": "Team with an abbreviation of " + req.params.team + " could not be found"});
        }


    }
}