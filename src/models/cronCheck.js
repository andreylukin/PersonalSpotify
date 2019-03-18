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






function getTimestamp() {
    let rawdata = JSON.parse(fs.readFileSync(config.path + 'PersonalSpotify/src/recent-songs.json'));
    return new Date(rawdata.timestamp);
}

function updateTimestamp(timestamp) {
    console.log("We got that timestamp " + timestamp + "\n");
    output = {timestamp: timestamp};
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
        for(let i = 0; i < tracks.length; i+=1) {
            let currentTrack = tracks[i];

            if(oldestRecorded < new Date(currentTrack.played_at) && new Date(currentNewest) < new Date(currentTrack.played_at)) {
                updateTimestamp(currentTrack.played_at);
                currentNewest = currentTrack.played_at;
            }

            if(oldestRecorded < new Date(currentTrack.played_at)) {
                console.log(currentTrack.track.name);
            }
        //     // console.log(response.body.items[i]);
        //     let name = response.body.items[i].track.name
        //     let artist= response.body.items[i].track.artists[0].name;
        //     // console.log(name + ": " + artist);
        //     console.log(response.body.items[i]);
        //     // let artistInfo = await spotifyApi.spotifyApi.getArtist(response.body.items[i].track.artists[0].id);
        //     // console.log({name, artistInfo: artistInfo.body.genres});
        //     // console.log(response.body.items[0].track.album.images);
        //     // return;
        // }
        // const trackAFInfo = await spotifyApi.spotifyApi.getAudioFeaturesForTrack(response.body.items[0].track.uri.split(":")[2]);
        // const trackAAInfo = await spotifyApi.spotifyApi.getAudioAnalysisForTrack(response.body.items[0].track.uri.split(":")[2]);

        // var page = 'Cosmo Sheldrake';
        // var language = 'en';

        // infobox(page, language, function(err, data){
        // if (err) {
        //     // Oh no! Something goes wrong!
        //     return;
        // }

        // console.log(data);
    // });
        }

        // let l = getWikipediaGenres("Cosmo Sheldrake");

        // console.log(response.body.items[response.body.items.length - 1]);
    })().then(console.log)
        .catch(console.log);
  } catch (e) {
    console.log(e.toString());
}
