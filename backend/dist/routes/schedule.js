/**
 * Schedule-based routes file
 */
var router  = require('express').Router();      // router instance
var HttpStatus  = require('http-status-codes'); // Http Status codes

/**
 ****************************************************************************
 * Middlewares
 ****************************************************************************
 */
var requestMiddleware = require('../middlewares/request');

/**
 * *********************************************************************
 *  Routes
 * **********************************************************************
 */

/**
 * HTTP Method: GET
 * Example URL: http://localhost:8080/api/v1/schedule/2017/01/12
 * Returns and JSON object of the games played on a given date
 */
router.get('/schedule/:YYYY/:MM/:DD', function(req, res) {
    var date = req.params.YYYY + '-' + req.params.MM + '-' + req.params.DD; // parsed date for the url

    var url = 'https://statsapi.web.nhl.com/api/v1/schedule?startDate=' + date + '&endDate=' + date;

    requestMiddleware.dataToJson(url)
        .then(function(results) {
        var games = [];

        for(var i = 0; i < requestMiddleware.getObjectLength(results.dates[0].games); i++) {
            var game = {
                "feedID": results.dates[0].games[i].gamePk,
                "startsAt": results.dates[0].games[i].gameDate,
                "teams": results.dates[0].games[i].teams,
                "venue": results.dates[0].games[i].venue.name

            };
            games.push(game);
        }

        var data = {
            "date": results.dates[0].date,
            "totalGames": results.totalGames,
            "games": games
        };
        res.contentType('application/json');
        res.status(HttpStatus.OK).json({"error": false, "message": null, "data": data});
    })
        .catch(function(err) {
            res.status(err.statusCode).json({"error": true, "message": "No results", "data": null});
    });
});

module.exports = router;