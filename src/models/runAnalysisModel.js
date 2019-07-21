
var moment = require('moment');

class runAnalysisModel {
    

    constructor(data) {
        this.data = data;
    }

    print() {
        let keys = Object.keys(this.data);
        let minDate = new Date(this.data[keys[0]].trackInfo.played_at);
        let maxDate = new Date(this.data[keys[keys.length - 1]].trackInfo.played_at);

        let newDate = moment(minDate);

        var diff = new moment.duration(maxDate - minDate);

        for(let i = 0; i < diff.asDays(); i+=1) {
            if(i % 7 == 0) {
                console.log(newDate);
                newDate.add(7, "days");
            }
        }

        // console.log({minDate, maxDate});
    }
}

module.exports = runAnalysisModel;