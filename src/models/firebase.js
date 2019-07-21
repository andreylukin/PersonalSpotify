var admin = require('firebase-admin');
<<<<<<< Updated upstream
var runAnalysisModel = require('./runAnalysisModel');
=======
const fs = require('fs');
const config = require("../config");
>>>>>>> Stashed changes

var serviceAccount = require('../firebase_auth.json');

function getMostRecentKey() {
    let rawdata = JSON.parse(fs.readFileSync(config.path + 'PersonalSpotify/src/recent-songs.json'));
    return rawdata.key;
}


module.exports = class Firebase {
    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://spotifypersonal-fb73f.firebaseio.com"
        });
        this.db = admin.database();
        this.ref = this.db.ref();
    }
    pushSong(obj) {
        var main = this.ref.child("main");
        let key  = main.push(obj).key;
        return key;
    }
    getSongs() {

        var main = this.ref.child("main");
        main.once("value").then(function(snapshot) {
            let runanalysismodel = new runAnalysisModel(snapshot.val());
            runanalysismodel.print();
          });

    }
}





