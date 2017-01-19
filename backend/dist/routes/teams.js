/**
 * Team-based routes file
 * Handles all the requests made to get any sort of team data
 * Routes are protected by the JWT authentication logic
 */
var router          = require('express').Router();      // router instance
var config          = require('../config/config');      // configuration file
var xRay            = require('x-ray');                 // "xray" package for web crawling
var x               = xRay(config.xray);                // initialize "xray" with options found in configuration file
require('express-group-routes');                        // group routes instance

/**
 ****************************************************************************
 * Middlewares
 ****************************************************************************
 */
var abbreviations = require('../middlewares/abbreviations'); // middleware to handle the abbreviations
var reqMiddleware = require('../middlewares/request'); // middleware to handle requests

/**
 * *********************************************************************
 *  Routes
 * **********************************************************************
 */

// group routes to '/teams/' prefix
router.group('/teams', function(router) {

    /**
     * HTTP Method: GET
     * Example URL: http://localhost:8080/api/teams/MTL
     * Fetches' basic team related data (team name, team abbreviation, team arena)
     * as well as basic statistics for each respective team
     * Team Request URL example: http://statsapi.web.nhl.com/api/v1/teams/12
     * Stats Request URL example: http://statsapi.web.nhl.com/api/v1/teams/12/stats
     */
    router.get('/:team', [abbreviations.isValidAbb, abbreviations.abbsToStatsAPIIds], function (req, res) {
        var endpoints = [
            'http://statsapi.web.nhl.com/api/v1/teams/' + req.params.id, // endpoint for team based data
            'http://statsapi.web.nhl.com/api/v1/teams/' + req.params.id + '/stats' // endpoint for stats based data
        ];

        reqMiddleware.asyncDataToJsonRequest(endpoints)
            .then(function (results) {
                var team = {
                    "id": results[0].teams[0].id,
                    "name": results[0].teams[0].name,
                    "abbreviation": results[0].teams[0].abbreviation,
                    "arena": results[0].teams[0].venue.name,
                    "stats": {
                        "leagueRecord": {
                            "gamesPlayed": results[1].stats[0].splits[0].stat.gamesPlayed,
                            "wins": results[1].stats[0].splits[0].stat.wins,
                            "losses": results[1].stats[0].splits[0].stat.losses,
                            "ot": results[1].stats[0].splits[0].stat.ot,
                            "pts": results[1].stats[0].splits[0].stat.pts
                        },

                        "goals": {
                            "goalsPerGame": results[1].stats[0].splits[0].stat.goalsPerGame,
                            "goalsAginstPerGame": results[1].stats[0].splits[0].stat.goalsAgainstPerGame

                        },
                        "special": {
                            "powerPlayGoals": results[1].stats[0].splits[0].stat.powerPlayPercentage,
                            "powerPlayGoalsAgainst": results[1].stats[0].splits[0].stat.powerPlayGoalsAgainst,
                            "powerPlayOpportunities": results[1].stats[0].splits[0].stat.powerPlayOpportunities,
                            "penaltyKillPercentage": results[1].stats[0].splits[0].stat.penaltyKillPercentage
                        },
                        "comparison": {
                            "leagueRecord": {
                                "wins": results[1].stats[1].splits[0].stat.wins,
                                "losses": results[1].stats[1].splits[0].stat.losses,
                                "ot": results[1].stats[1].splits[0].stat.ot,
                                "pts": results[1].stats[1].splits[0].stat.pts
                            },
                            "goals": {
                                "goalsPerGame": results[1].stats[1].splits[0].stat.goalsPerGame,
                                "goalsAginstPerGame": results[1].stats[1].splits[0].stat.goalsAgainstPerGame
                            },
                            "special": {
                                "powerPlayGoals": results[1].stats[1].splits[0].stat.powerPlayPercentage,
                                "powerPlayGoalsAgainst": results[1].stats[1].splits[0].stat.powerPlayGoalsAgainst,
                                "powerPlayOpportunities": results[1].stats[1].splits[0].stat.powerPlayOpportunities,
                                "penaltyKillPercentage": results[1].stats[1].splits[0].stat.penaltyKillPercentage
                            }
                        }
                    }
                };
                res.contentType('application/json');
                res.status(200).json(team);

            })
            .catch(function (err) { // handle possible errors
                res.status(err.statusCode).json(JSON.parse(err.body));
            });
    });

    /**
     * HTTP Method: GET
     * Example URL: http://localhost:8080/api/teams/MTL/lineup
     * The most recent projected line-up for respective team
     * Scrape the projected line-up at the given URL and finally outputs them in a JSON format
     * Request URL example: http://www2.dailyfaceoff.com/teams/lines/14/winnipeg-jets
     */
    router.get('/:team/lineup', [abbreviations.isValidAbb, abbreviations.abbsToDFIds, abbreviations.abbToSlug], function (req, res) {
        var url = 'http://www2.dailyfaceoff.com/teams/lines/' + req.params.id + '/' + req.params.slug;
        var stream = x(url, '#matchups_container', {
            team: {
                name: 'span.logo@title'
            },
            "projectedLineUp": {
                lastUpdatedOn: '.date-comments | slice:13',
                forwards: x('table#forwards.playerlist tbody tr', [{
                    line: x('td', [{
                        player: {
                            position: '@id | slice:0,-1',
                            name: 'a img@alt'
                        }
                    }])
                }]),
                defense: x('table#defense.playerlist tbody tr', [{
                    pair: x('td', [{
                        player: {
                            position: '@id | slice:0,-1',
                            name: 'a img@alt'
                        }
                    }])
                }])
            }
        }).stream();

        res.contentType('application/json');
        stream.pipe(res); // return results in JSON
    });

    /**
     * HTTP Method: GET
     * Example URL: http://localhost:8080/api/teams/MTL/injuries
     * The most recent injury report for each respective team
     * Scrape the injured players at the given URL and finally outputs them in a JSON format
     * Request URL example: http://www.rotoworld.com/teams/injuries/nhl/ana/
     */
    router.get('/:team/scratches', [abbreviations.isValidAbb, abbreviations.abbsToRPKeys], function(req, res) {
        var url = 'http://www.rotoworld.com/teams/injuries/nhl/' + req.params.rotoAbb;
        var stream = x(url, '.pb', {
            team: {
                name: '.player a'
            },
            "players": x('table tr:not(:first-child)', [{
                player: {
                    name: "td a",
                    position: "td:nth-of-type(3)",
                    absence: {
                        lastUpdatedOn: '.date',
                        date: 'td:nth-of-type(5)',
                        cause: 'td:nth-of-type(6) | capitalizeString',
                        expectedReturn: 'td:nth-of-type(7)'
                    }
                }
            }])
        }).stream();

        res.contentType('application/json');
        stream.pipe(res); // return results in JSON
    });

    // TODO Last games route for team (Endpoint URL: https://statsapi.web.nhl.com/api/v1/schedule?startDate=2017-01-01&endDate=2017-01-31&teamId={id})
});
module.exports = router; // export this module to server.js
