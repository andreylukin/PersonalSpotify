const Firebase  = require("./firebase.js");

try {
    (async () => {


    const firebase = new Firebase();

    firebase.getSongs();
})().then(console.log)
    .catch(console.log);
} catch (e) {
console.log(e.toString());
}