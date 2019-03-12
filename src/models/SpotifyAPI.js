const SpotifyWebApi = require('spotify-web-api-node');

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


}

module.exports.SpotifyApi = SpotifyApi;