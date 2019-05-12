require('dotenv').config();

// var keys = require("./keys.js");
// var Spotify = require('node-spotify-api');
// var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");

if (process.argv.length < 3) {
    printUsage();
} else {
    const command = process.argv[2];
    const arg = process.argv[3];
    console.log(process.argv);
    doCommand(command, arg);
}

function doCommand(command, arg) {
    if (arg) {
        // TODO strip off quotes
    }

    switch (command) {
        case 'concert-this': {
            concertThis(arg);
            break;
        }
        case 'spotify-this-song': {
            spotifyThis(arg);
            break;
        }
        case 'movie-this': {
            movieThis(arg);
            break;
        }
        case 'do-what-it-says': {
            doIt();
            break;
        }
        default: {
            printUsage();
            break;
        }
    }
}

function concertThis(artist) {
    var artist = process.argv.slice(2).join("+");
 

    var queryUrl = "http://bandsintown" + artist + "&y=&plot=short&apikey=trilogy";
    // TODO make this apply to BandsIntown get correct URL
    axios.get(queryUrl)
    .then(function (response) {
            console.log("****** Liri found your Concert! ***** " + response.data.Title);
            // TODO add rest of Data
        })


    console.log("concertThis is being called " + artist);
}

// function spotifyThis(song) {
//     var song = process.argv.slice(2).join("+");
//     var key = Spotify(keys.spotify);

//     var queryUrl = "http://spotify" + song + "&apikey=" + key;
//     // TODO Get correct spotify URL

//     Spotify.get(queryUrl).then(
//         function (response) {
//             console.log("You Entered " + response.data.Title);
//             console.log("Release Date " + response.data.Released);
//             // TODO add rest of data responses
//         }
//     )


//     console.log("spotifyThis is being called " + song);
//}

function movieThis(movie) {
    var movie = process.argv.slice(3).join(" + ");
   
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    axios.get(queryUrl)
    .then(function (response) {
            console.log("***** Liri found your movie! *****\n"  
            + "* " + response.data.Title + "\n" 
            + "* Year Made: " + response.data.Year + "\n" 
            + "* IMDB Rating: " + response.data.imdbRating + "\n"
            + "* Rotten Tomatoes Score: " + response.data.Ratings[1].Value + "\n" 
            + "* Made in: " + response.data.Country + "\n"
            + "* Language: " + response.data.Language + "\n"
            + "* Plot: " + response.data.Plot + "\n"
            + "* Actors: " + response.data.Actors);
     })
    
    .catch(function (error) {
      console.log(error);
    });
        

    //console.log("movieThis is being called " + movie);
}

function doIt() {
    console.log("DoIt is being called");
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        const randomText = data.split(",");
        console.log("***** Liri will do it! ***** " + randomText);
        doCommand(randomText[0], randomText[1]);
    });
}

function printUsage() {
    console.log("***** Liri does not understand. *****")
}

/*
switch on user input argv[2]

switch
argv[3] may or may not exist
==============================================
// concert-this
//node liri.js concert-this <artist/band name here>

Name of the venue
Venue location
Date of the Event (use moment to format this as "MM/DD/YYYY")

==============================================
// spotify-this-song
node liri.js spotify-this-song '<song name here>'
This will show the following information about the song in your terminal/bash window

Artist(s)
The song's name
A preview link of the song from Spotify
The album that the song is from

If no song is provided then your program will default to "The Sign" by Ace of Base.

==============================================
// movie-this
node liri.js movie-this '<movie name here>'

This will output the following information to your terminal/bash window:
  * Title of the movie.
  * Year the movie came out.
  * IMDB Rating of the movie.
  * Rotten Tomatoes Rating of the movie.
  * Country where the movie was produced.
  * Language of the movie.
  * Plot of the movie.
  * Actors in the movie.

If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'

==============================================
// do-what-it-says
node liri.js do-what-it-says

Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
Edit the text in random.txt to test out the feature for movie-this and concert-this.

*/
