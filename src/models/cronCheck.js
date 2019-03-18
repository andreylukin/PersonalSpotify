const config = require("../config");
var wikiParser = require('wiki-infobox-parser');
const fs = require('fs');
const SpotifyApi  = require("./SpotifyAPI.js");

// async function getMyDeviceId() {
//     const response = await this.spotifyApi.getMyDevices();
//     // const device = response.body.devices.filter( device => device.name === "PHILCO")[0];// use "PHILCO" usually
//     // return device === undefined ? "Philoco aint here" : device.id;
//     if(response.body != null) {
//         return response.body.devices[0];
//     }
//     return null;
// }


// async function getWikipediaGenres(artist) {
//     let response = wikiParser(artist, function(err, result) {
//         if (err) {
//             console.error(err.message);
//         } else {
//             return result;
//         }
//     });
//     console.log(response);
//     return response;
// }



function writeToRecord(obj) {
    let rawdata = JSON.parse(fs.readFileSync(config.path + 'PersonalSpotify/src/main-data.json'));
    let arr = obj.concat(rawdata.main);
    let temp = {};
    temp.main = arr;
    fs.writeFileSync(config.path + 'PersonalSpotify/src/main-data.json', JSON.stringify(temp));

}




function getTimestamp() {
    let rawdata = JSON.parse(fs.readFileSync(config.path + 'PersonalSpotify/src/recent-songs.json'));
    return new Date(rawdata.timestamp);
}

function updateTimestamp(timestamp, name) {
    output = {timestamp: timestamp, name: name};
    fs.writeFileSync(config.path + 'PersonalSpotify/src/recent-songs.json', JSON.stringify(output));
}


try {
    (async () => {
        const spotifyApi = new SpotifyApi();
        await spotifyApi.authenticate();
        const response = await spotifyApi.spotifyApi.getMyRecentlyPlayedTracks();
        let tracks = response.body.items;
        let oldestRecorded = getTimestamp();
        let currentNewest = 0;
        let allSongData = []
        for(let i = 0; i < tracks.length; i+=1) {
            let currentTrack = tracks[i];
            let recordObj = {};

            if(oldestRecorded < new Date(currentTrack.played_at) && new Date(currentNewest) < new Date(currentTrack.played_at)) {
                updateTimestamp(currentTrack.played_at, currentTrack.track.name);
                currentNewest = currentTrack.played_at;
            }

            if(oldestRecorded < new Date(currentTrack.played_at)) {
                console.log(currentTrack.track.name);
            }
            recordObj.trackInfo = {};
            recordObj.trackInfo.name = currentTrack.track.name;
            recordObj.trackInfo.popularity = currentTrack.track.popularity;
            recordObj.trackInfo.uri = currentTrack.track.uri;


            recordObj.albumInfo = {};
            recordObj.albumInfo.name = currentTrack.track.album.name;
            recordObj.albumInfo.album_type = currentTrack.track.album.album_type;
            recordObj.albumInfo.release_date = currentTrack.track.album.release_date;
            recordObj.albumInfo.total_tracks = currentTrack.track.album.total_tracks;


            const artistInfo = await spotifyApi.spotifyApi.getArtist(currentTrack.track.artists[0].id);
            recordObj.artistInfo = {};
            recordObj.artistInfo.name = artistInfo.body.name;
            recordObj.artistInfo.popularity = artistInfo.body.popularity;
            recordObj.artistInfo.followers = artistInfo.body.followers.total;
            recordObj.artistInfo.genres = artistInfo.body.genres;



            const trackAFInfo = await spotifyApi.spotifyApi.getAudioFeaturesForTrack(currentTrack.track.uri.split(":")[2]);
            recordObj.trackAnalysisInfo = {};
            recordObj.trackAnalysisInfo.danceability = trackAFInfo.body.danceability;
            recordObj.trackAnalysisInfo.energy = trackAFInfo.body.energy;
            recordObj.trackAnalysisInfo.key = trackAFInfo.body.key;
            recordObj.trackAnalysisInfo.mode = trackAFInfo.body.mode;
            recordObj.trackAnalysisInfo.speechiness = trackAFInfo.body.speechiness;
            recordObj.trackAnalysisInfo.instrumentalness = trackAFInfo.body.instrumentalness;
            recordObj.trackAnalysisInfo.liveness = trackAFInfo.body.liveness;
            recordObj.trackAnalysisInfo.valence = trackAFInfo.body.valence;
            recordObj.trackAnalysisInfo.tempo = trackAFInfo.body.tempo;

            allSongData.push(recordObj);
            
        }
        writeToRecord(allSongData);
    })().then(console.log)
        .catch(console.log);
  } catch (e) {
    console.log(e.toString());
}
