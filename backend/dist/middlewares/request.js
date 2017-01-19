var request = require('request');           // request instance
var Promise = require('promise');           // Promise library for data returning
var cheerio = require('cheerio');           // cheerio library for loading DOM's HTML

var req = {

    dataToJson: function (url) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, response, body) {
                if (error)
                    reject(error);
                else if (response.statusCode !== 200)
                    reject(response);
                else
                    body = JSON.parse(body);
                    resolve(body);
            });
        });
    },

    asyncDataToJsonRequest: function (endpoints) {
        return Promise.all(endpoints.map(function (url) {
            return req.dataToJson(url);
        }));

    },

    dataToHtml: function (url) {
        return new Promise(function (resolve, reject) {
            request(url, function (error, response, html) {
                if (error)
                    reject(error);
                else if (response.statusCode !== 200)
                    reject(response);
                else
                    html = cheerio.load(html);
                    resolve(html);
            });
        });
    },

    getObjectLength: function (obj) {
        var length = 0;
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                length++;
            }
        }
        return length;
    }
};
module.exports = req;
