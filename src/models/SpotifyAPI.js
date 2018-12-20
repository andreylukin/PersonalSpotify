const SpotifyWebApi = require('spotify-web-api-node');
const config = require("../config");
var wikiParser = require('wiki-infobox-parser');


async function getMyDeviceId() {
    const response = await this.spotifyApi.getMyDevices();
    // const device = response.body.devices.filter( device => device.name === "PHILCO")[0];// use "PHILCO" usually
    // return device === undefined ? "Philoco aint here" : device.id;
    if(response.body != null) {
        return response.body.devices[0];
    } 
    return null;
}

async function isShuffle() {
    const response = await this.spotifyApi.getMyCurrentPlaybackState();
    return response.body.shuffle_state;
}

class SpotifyApi {
    constructor() {
        this.spotifyApi = new SpotifyWebApi({
            clientId : config.username,
            clientSecret : config.password
        });
    }

    async authenticate() {
        this.spotifyApi.setRefreshToken(config.refreshToken);
        const response = await this.spotifyApi.refreshAccessToken();
        this.spotifyApi.setAccessToken(response.body['access_token']);
    }

    async startMusic(context_uri) {
        const deviceIds = await getMyDeviceId.bind(this)();
        console.log(deviceIds);
        await this.spotifyApi.transferMyPlayback({deviceIds: [deviceIds] })
        await this.spotifyApi.play({device_id: deviceIds, context_uri: context_uri || undefined})
    }

    async stopMusic() {
        const device = await getMyDeviceId.bind(this)();
        // console.log(deviceId);
        await this.spotifyApi.pause({device_id: device.id})
    }

    async startPlaylist(number) {
        number = number || 0;
        const playlists = await this.spotifyApi.getUserPlaylists();
        const playlistURIs = playlists.body.items;
        this.startMusic(playlistURIs[number].uri);
    }

    async getNumberofPlaylist() {
        const playlists = await this.spotifyApi.getUserPlaylists();
        const playlistURIs = playlists.body.items.map(item => item.uri);
        return playlistURIs.length;
    }

    async next() {
        await this.spotifyApi.skipToNext();
    }
    async previous() {
        await this.spotifyApi.skipToPrevious();
    }

    async shuffle() {
        const isShuffling = await isShuffle.bind(this)();
        await this.spotifyApi.setShuffle({state: (!isShuffling).toString()});
        console.log(`Now shuffling is ${!isShuffling}`);
    }

}


module.exports = SpotifyApi;

const spotifyApi = new SpotifyApi();
try {
    (async () => {
        // await spotifyApi.authenticate();
        // const response = await spotifyApi.spotifyApi.getMyRecentlyPlayedTracks();
        // // console.log(response.body.items[0]);
        // for(let i = 0; i < 1; i+=1) { // response.body.items.length
        //     console.log(response.body.items[i]);
        //     let name = response.body.items[i].track.name
        //     let albumInfo = await spotifyApi.spotifyApi.getAlbum(response.body.items[i].track.album.id);
        //     let artistInfo = await spotifyApi.spotifyApi.getArtist(response.body.items[i].track.artists[0].id);
        //     console.log({name, albumInfo : albumInfo.body.genres.length, artistInfo: artistInfo.body.genres.length});
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
    wikiParser('Cosmo Sheldrake', function(err, result) {
        if (err) {
              console.error(err.message);
          } else {
              console.log(JSON.parse(result).genre);
          }
      });
    })().then(console.log)
        .catch(console.log);
  } catch (e) {
    console.log(e.toString());
}