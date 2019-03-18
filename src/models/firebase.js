var admin = require('firebase-admin');


var serviceAccount = require('../firebase_auth.json');



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
}




