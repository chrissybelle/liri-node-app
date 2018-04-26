require("dotenv").config();

// V A R I A B L E S
var keys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var params = {count: 20};
var dataToLog;

// stores user inputs (command and song/movie title)
var command = process.argv[2];
var title = process.argv.slice(3).join("+");

// print which command is running
function printCommand() {
  console.log("You asked me to run: " + command + " " + title );
}

// MY-TWEETS COMMAAND - DISPLAYS LAST 20 TWEETS
function myTweets() {
  if (command === "my-tweets") {
    printCommand();
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      console.log("------------------------------");
      //if no error, then print tweets to terminal
      if (!error) {
        for (var i=0; i <20; i++) {
          console.log(tweets[i].text);
          dataToLog = (tweets[i].text);
          addToLog();
        }
      }
      console.log("------------------------------");
    });
  }
}

// SPOTIFY-THIS-SONG COMMAND
//if song title is specified, then
function spotifyThis() {
  if (command === "spotify-this-song" && title !== "") {
    printCommand();
    // console.log(title);
    spotify.search({type:"track", query: "\""+ title+ "\"", limit: 1}, function(err, data) {
      var spotifyData = data.tracks.items[0];
      console.log("------------------------------");
      if (err) {
        console.log("Error: " + err);
      } else {
      //prints artist name, song name, preview link, and album name to terminal
      console.log("ARTIST NAME: " + spotifyData.artists[0].name);
      console.log("SONG NAME: " + spotifyData.name);
      console.log("PREVIEW LINK: " + spotifyData.preview_url);
      console.log("ALBUM NAME: " + spotifyData.album.name);
      dataToLog = "ARTIST NAME: " + spotifyData.artists[0].name + "\n" + "SONG NAME: " + spotifyData.name + "\n" + "PREVIEW LINK: " + spotifyData.preview_url + "\n" + "ALBUM NAME: " + spotifyData.album.name;
      addToLog();
      }
      console.log("------------------------------");
    })
  //if no song title is specified, details for "the sign" will print to the terminal
  } else if (command === "spotify-this-song" && title === "") {
    printCommand();
    title = "the sign";
    spotify.search({type:"track", query: "\""+ title+ "\"", limit: 1}, function(err, data) {
      var spotifyData = data.tracks.items[0];
      console.log("------------------------------");
      if (err) {
        console.log("Error: " + err);
      } else {
        console.log("ARTIST NAME: " + spotifyData.artists[0].name);
        console.log("SONG NAME: " + spotifyData.name);
        console.log("PREVIEW LINK: " + spotifyData.preview_url);
        console.log("ALBUM NAME: " + spotifyData.album.name);
        dataToLog = "ARTIST NAME: " + spotifyData.artists[0].name + "\n" + "SONG NAME: " + spotifyData.name + "\n" + "PREVIEW LINK: " + spotifyData.preview_url + "\n" + "ALBUM NAME: " + spotifyData.album.name;
        addToLog();
    }
    console.log("------------------------------");
  })
  }
}

// MOVIE-THIS COMMAND (OMDB)
//if movie title is specified, then
function movieThis() {
  if (command === "movie-this" && title !== "") {
    printCommand();
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + title, function (error, response, body) {
      console.log("------------------------------");
        if (error) {
            console.log('error:' + error);
        } else {
          //prints movie details to terminal
          // console.log('statusCode:', response && response.statusCode);
          var info = JSON.parse(body);
          // console.log(info);
          var IMDBrating;
          var RTrating;
          //searches through Ratings array to locate IMDB and RT ratings; store in variables
          for (var i=0; i<info.Ratings.length; i++) {
            if (info.Ratings[i].Source === "Internet Movie Database") {
              IMDBrating = info.Ratings[i].Value;
            } else if (info.Ratings[i].Source === "Rotten Tomatoes") {
              RTrating = info.Ratings[i].Value;
            }
          }
            console.log("MOVIE TITLE: " + info.Title);
            console.log("YEAR OF RELEASE: " + info.Year);
            console.log("IMDB RATING: " + IMDBrating);
            console.log("ROTTEN TOMATOES RATING: " + RTrating);
            console.log("MOVIE LANGUAGE: " + info.Language);
            console.log("MOVIE PLOT: " + info.Plot);
            console.log("ACTORS: " + info.Actors);
            dataToLog = "MOVIE TITLE: " + info.Title + "\n" + "YEAR OF RELEASE: " + info.Year + "\n" + "IMDB RATING: " + IMDBrating + "\n" + "ROTTEN TOMATOES RATING: " + RTrating + "\n" + "MOVIE LANGUAGE: " + info.Language + "\n" + "MOVIE PLOT: " + info.Plot + "\n" + "ACTORS: " + info.Actors;
            addToLog(); 
        } 
        console.log("------------------------------");
      });
    //if movie title is not specified, then display movie details for "Mr. Nobody"
    } else if (command === "movie-this" && title === "") {
      printCommand();
      title = "mr+nobody";
      request('http://www.omdbapi.com/?apikey=trilogy&t=' + title, function (error, response, body) {
        console.log("------------------------------");
        if (error) {
            console.log('error:', error);
        } else {
          console.log('statusCode:', response && response.statusCode);
          var info = JSON.parse(body);
          // console.log(info);
          var IMDBrating;
          var RTrating;
          //searches through Ratings array to locate IMDB and RT ratings; store in variables
          for (var i=0; i<info.Ratings.length; i++) {
            if (info.Ratings[i].Source === "Internet Movie Database") {
              IMDBrating = info.Ratings[i].Value;
            } else if (info.Ratings[i].Source === "Rotten Tomatoes") {
              RTrating = info.Ratings[i].Value;
            }
          }
          console.log("MOVIE TITLE: " + info.Title);
          console.log("YEAR OF RELEASE: " + info.Year);
          console.log("IMDB RATING: " + IMDBrating);
          console.log("ROTTEN TOMATOES RATING: " + RTrating);
          console.log("MOVIE LANGUAGE: " + info.Language);
          console.log("MOVIE PLOT: " + info.Plot);
          console.log("ACTORS: " + info.Actors);
          dataToLog = "MOVIE TITLE: " + info.Title + "\n" + "YEAR OF RELEASE: " + info.Year + "\n" + "IMDB RATING: " + IMDBrating + "\n" + "ROTTEN TOMATOES RATING: " + RTrating + "\n" + "MOVIE LANGUAGE: " + info.Language + "\n" + "MOVIE PLOT: " + info.Plot + "\n" + "ACTORS: " + info.Actors;
          addToLog(); 
        }
        console.log("------------------------------");
      });
    }
  }

// alerts user if command is valid
if (command !== "my-tweets" && command !== "spotify-this-song" && command !== "movie-this" && command !== "do-what-it-says") {
  console.log("I'm sorry, I don't understand your command. Please try again.");
} else {
  console.log("Your wish is my command.");
}

// DO-WHAT-IT-SAYS COMMAND
if (command === "do-what-it-says") {
  printCommand();
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      command = data.split(",")[0];
      title = data.split(",")[1];
      myTweets();
      spotifyThis();
      movieThis();
    }
  });
}

myTweets();
spotifyThis();
movieThis();


// BONUS: outputs all data to log.txt
function addToLog() {
  fs.appendFile("log.txt", "\n" + dataToLog, function(err) {
    if (err) {
      console.log(err);
    }
  }
  )
}