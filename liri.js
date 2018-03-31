// INIT .env
require("dotenv").config();
// VARIABLES
var Twitter = require('twitter')
var request = require('request')
var Spotify = require('node-spotify-api')
var fs = require('fs')
var keys = require('./keys.js')
var userInput = process.argv;
var command = userInput[2];
var searchParms = userInput.slice(3, userInput.length).join(' ');
var omdbParms = userInput.slice(3, userInput.length).join('+');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// GET COMMAND AND RUN FUNCTION
runLiri();
function runLiri() {
    switch (command) {
        case 'my-tweets':
            fetchMyTweets();
            break;
        case 'spotify-this-song':
            fetchSpotify();
            break;
        case 'movie-this':
            fetchMovie();
            break;
        case 'do-what-it-says':
            fetchDoWhatItSays();
    }
}
// TWITTER
function fetchMyTweets() {
    client.get('statuses/user_timeline', function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length && i < 20; i++)
                console.log('Tweet #' + (i + 1) + '\n' + '-----------------' + '\n' + tweets[i].text + '\n' + tweets[i].retweet_count + ' retweets' + '\n' + tweets[i].created_at + '\n' + '-----------------');
        }
    });
}
// SPOTIFY
function fetchSpotify() {
    if (searchParms !== '') {
        spotify.search({
            type: 'track',
            query: searchParms
        }, function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items[0];
                console.log('Title: ' + trackInfo.name + '\nAlbum: ' + trackInfo.album.name + '\nArtists: ');
                for (i = 0; i < trackInfo.album.artists.length; i++) {
                    console.log(trackInfo.artists[i].name)
                }
                console.log('Preview Link: ' + trackInfo.href)
            }
        })
    } else {
        spotify.search({
            type: 'track',
            query: 'The Sign Ace of Base'
        }, function (err, data) {
            if (!err) {
                var trackInfo = data.tracks.items[0];
                console.log('Title: ' + trackInfo.name + '\nAlbum: ' + trackInfo.album.name + '\nArtists: ');
                for (i = 0; i < trackInfo.album.artists.length; i++) {
                    console.log(trackInfo.artists[i].name)
                }
                console.log('Preview Link: ' + trackInfo.href)
            }
        })
    }
}
// OMBD
function fetchMovie() {
    var url = 'http://www.omdbapi.com/?t=' + omdbParms + '?' + keys.omdb.key;
    console.log(url);
    request(url, function (error, response, body) {
        if (!error) {
            var movie = JSON.parse(body);
            console.log('Title: ' + movie.Title + '\nYear: ' + movie.Year + '\nIMDB rating: ' + movie.imdbRating + '\nRotten Tomatoes Rating: ' + movie.Ratings[1].Value + '\nCountry: ' + movie.Country + '\nLanguage: ' + movie.Language + '\nPlot: ' + movie.Plot + '\nActors: ' + movie.Actors);
        } else {
            console.log(error)
        }
    })
}
// DO WHAT IT SAYS
function fetchDoWhatItSays() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            var dataArr = data.split(',');
            command = dataArr[0];
            movieSong = dataArr[1];
            movieSong = movieSong.replace('"', ' ');
            movieSong = movieSong.replace('"', ' ');
            runLiri();
        }
    });
}