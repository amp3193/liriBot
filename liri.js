require('dotenv').config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
const moment = require("moment");
var axios = require("axios");
var fs = require("fs");
const chalk = require("chalk");


if (process.argv.length < 3) {
    printUsage();
} else {
    const command = process.argv[2];
    const arg = process.argv.slice(3).join(" ");
    doCommand(command, arg, true);
}


function doCommand(command, arg, shouldLog) {
    //console.log(`Command: ${command}, Argument: ${arg}`)

    switch (command) {
        case 'concert-this': {
            concertThis(arg);
            if (shouldLog) {
                logIt(command, arg);
            }
            break;
        }
        case 'spotify-this-song': {
            spotifyThis(arg);
            if (shouldLog) {
                logIt(command, arg);
            }
            break;
        }
        case 'movie-this': {
            movieThis(arg);
            if (shouldLog) {
                logIt(command, arg);
            }
            break;
        }
        case 'do-what-it-says': {
            doIt();
            if (shouldLog) {
                logIt(command, arg);
            }
            break;
        }
        case 'book-this': {
            bookThis(arg);
            if (shouldLog) {
                logIt(command, arg);
            }
            break;
        }
        case 'repeat-this-log': {
            repeatIt();
            break;
        }
        default: {
            printUsage();
            break;
        }
    }
}

    function concertThis(artist) {
        if (!artist || artist === '') {
            console.log(chalk.red("***** Liri needs a valid Artist! *****"))
        } else {
            let queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

            axios.get(queryUrl)
                .then(allConcerts)
                .catch(function (error) {
                    console.log(chalk.red(error));
                });
        }
    }

    function allConcerts(response) {
        let maxResults = response.data.length;
        console.log(chalk.greenBright(`****** Liri found ${response.data.length} concerts! *****`));

        if (maxResults > 5) {
            maxResults = 5;
            console.log(chalk.greenBright("***** Displaying the first 5... *****"));
        }

        for (let i = 0; i < maxResults; i++) {
            const allConcerts = response.data[i];
            const date = moment(allConcerts.datetime).format('MM/DD/YYYY');
            console.log(chalk.greenBright(
                "\n* Artists: " + allConcerts.lineup +
                "\n* Venue: " + allConcerts.venue.name +
                "\n* Location: " + allConcerts.venue.city +
                "\n* Date of Show: " + date));
        }
    }

    function spotifyThis(song) {
        if (!song || song === '') {
            song = 'The Sign ace of base';
        }

        spotify.search({
            type: "track",
            query: song,
            limit: 3
        }, function (err, response) {
            //console.log(JSON.stringify(response, undefined, 3));
            if (err) {
                console.log(chalk.red('Error occurred: ' + err));
            } else {
                var songs = response.tracks.items;
                for (var i = 0; i < songs.length; i++) {
                    console.log(chalk.magentaBright("\n***** Liri Found your Song! *****" +
                        "\n* Artist(s): " + songs[i].artists[0].name +
                        "\n* Title: " + songs[i].name +
                        "\n* Preview Link: " + songs[i].artists[0].external_urls.spotify +
                        "\n* Album: " + songs[i].album.name));
                }
            }
        });
    }

    function movieThis(movie) {
        if (!movie || movie === '') {
            movie = 'Mr. Nobody';
        }

        let queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        axios.get(queryUrl)
            .then(function (response) {
                console.log(chalk.yellowBright("\n***** Liri found your movie! *****" +
                    "\n* Title: " + response.data.Title +
                    "\n* Year Made: " + response.data.Year +
                    "\n* IMDB Rating: " + response.data.imdbRating +
                    "\n* Rotten Tomatoes Score: " + response.data.Ratings[1].Value +
                    "\n* Made in: " + response.data.Country +
                    "\n* Language: " + response.data.Language +
                    "\n* Plot: " + response.data.Plot +
                    "\n* Actors: " + response.data.Actors));
            })

            .catch(function (error) {
                console.log(chalk.red(error));
            });
    }

    function doIt() {
        fs.readFile('./random.txt', 'utf8', function (error, data) {
            const randomText = data.split(",");
            console.log(chalk.green.bold("***** Liri will do it! ***** " + "\n" + randomText));
            doCommand(randomText[0], randomText[1], false);
        });
    }

    function logIt(command, arg) {
        fs.appendFile('./log.txt', `${command},${arg}\n`, function (err) {
            if (err) throw err;
        });
    }

    function printUsage() {
        console.log(chalk.cyan.bold(`
            \n***** Hello I'm Liri! ***** 
            \nPlease type one of the following commands and add what you'd like to find after it: 
            \n* To Find a Concert: concert-this 
            \n* To Find a Movie: movie-this
            \n* To Find a Song: spotify-this-song
            \n* To Find a Book: book-this
            \n* Try this for something random: do-what-it-says
            \n* Try this to repeat all of your previous commands: repeat-this-log`));
    }

    function repeatIt() {
        fs.readFile('./log.txt', 'utf8', function (error, data) {
            console.log(chalk.yellow("***** Liri will Repeat your Log! ***** "));
            const logText = data.split("\n");
            for (let i = 0; i < logText.length; i++) {
                const logEach = logText[i].trim();
                if (logEach.length > 0) {
                    const lText = logEach.split(",");
                    doCommand(lText[0], lText[1], false);
                }
            }
        });
    }

    function bookThis(title) {
        if (!title || title === '') {
            console.log(chalk.red("***** Liri needs a valid Title! *****"))
        } else {
            let queryUrl = "https://www.googleapis.com/books/v1/volumes?q=" + title + "&key=AIzaSyAY4_-Mqs42ukF38ViEQpSWkBEsOdSiBdA";

            axios.get(queryUrl)
                .then(function (response) {
                    console.log(chalk.cyanBright("\n***** Liri found your Book! *****" +
                        "\n* Title: " + response.data.items[0].volumeInfo.title +
                        "\n* Written By: " + response.data.items[0].volumeInfo.authors +
                        "\n* Description: " + response.data.items[0].volumeInfo.description +
                        "\n* For Purchase at: " + response.data.items[0].saleInfo.buyLink));
                })

                .catch(function (error) {
                    console.log(chalk.red(error));
                });
        }
    }
