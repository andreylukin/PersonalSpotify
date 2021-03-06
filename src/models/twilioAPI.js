const SpotifyApi  = require("./SpotifyAPI.js");
const config = require('../config');
var express = require('express')
var app = express()
const port = 80
const MessagingResponse = require('twilio').twiml.MessagingResponse;

var twilio = require('twilio');

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


const spotifyApi = new SpotifyApi();


app.post('/text', function (req, res) {

    try {
        (async () => {
            const twiml = new MessagingResponse();
            let message = await getMessage();
            twiml.message(message)
            res.writeHead(200, {'Content-Type': 'text/xml'});
            res.end(twiml.toString());
        })().then(console.log)
        .catch(console.log);
    } catch (e) {
        console.log(e.toString());
    }



})



async function getMessage() {
    await spotifyApi.authenticate();
    const response = await spotifyApi.spotifyApi.getMyCurrentPlayingTrack();
    const track = await getTrackInfo(response.body.item);
    const artist = await getArtistInfo(response.body.item.artists[0].id);
    return generateTextBody(track, artist);
}








function sendText(message) {
    const client = require('twilio')(config.accountSid, config.authToken);
    client.messages.create({
        body: message,
        from: '+18186394935',
        to: '+16314131686'
    })
    .then(message => console.log(message.sid));
}


function generateTextBody(trackInfo, artistInfo) {
    const trackText = `"${trackInfo.name}" by ${trackInfo.artist} is playing with popularity of ${trackInfo.popularity}.`;
    const artistText = `The artist's genres are ${artistInfo.genres.join(", ")}.\n\nThey have ${artistInfo.followers} followers with ${artistInfo.popularity} popularity.`;
    return `${trackText}\n\n${artistText}`;
}

async function getArtistInfo(artistId) {
    const artistInfo = await spotifyApi.spotifyApi.getArtist(artistId);
    return {genres: artistInfo.body.genres, followers: artistInfo.body.followers.total, popularity: artistInfo.body.popularity};
}

async function getTrackInfo(response) {
    return {name: response.name, popularity: response.popularity, artist: response.artists[0].name};
}



app.listen(port, () => console.log(`Example app listening on port ${port}!`))

