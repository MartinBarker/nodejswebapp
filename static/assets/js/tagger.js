$(document).ready(function() {
    //function to make sure hitting 'enter' key submits input box
    $(window).keydown(function(event){
      if(event.keyCode == 13) {
        event.preventDefault();
        document.getElementById("urlInputButton").click();
        return false;
      }
    });
  });

async function inputOption1(input) {
    console.log("inputOption1()")
    //parse release id from url
    var urlArr = input.split('/');
    var discogsListingType = urlArr[urlArr.length-2];
    var discogsListingCode = urlArr[urlArr.length-1];
    //get tracklist from discogs API
    let discogsTracklist = await getTracklistFromDiscogs(discogsListingType, discogsListingCode)
    if(discogsTracklist != 'error'){
        let taggerData = await getTaggerData(discogsTracklist)
    }
}

async function getTaggerData(tracklist){
    var taggerData = []
    taggerData['key'] = {help: 'bungis'}

    var startTimeSeconds = 0;
    var endTimeSeconds = 0;
    for(var i = 0; i < tracklist.length; i++){
        console.log("track " + i) //+ " title = ", tracklist[i].duration)
        var trackTimeSeconds = moment.duration(tracklist[i].duration).asMinutes()
        console.log("track time seconds = ", trackTimeSeconds)
        var trackTimeMinutes = new Date(trackTimeSeconds * 1000).toISOString().substr(11, 8);
        console.log("track time minutes = ", trackTimeMinutes)

        console.log("track startTime = ", secondsToTimestamp(startTimeSeconds))
        endTimeSeconds = endTimeSeconds + trackTimeSeconds
        console.log("track endTime = ", secondsToTimestamp(endTimeSeconds))
        
        //add data to object
        var trackData = {title: tracklist[i].title, startTime: secondsToTimestamp(startTimeSeconds), endTime:secondsToTimestamp(endTimeSeconds}
        taggerData.push(trackData)

        //end of for loop cleanup
        startTimeSeconds = startTimeSeconds + trackTimeSeconds

        console.log("\n")
   } 
   console.log("end of for loop, taggerData = ", taggerData)
   resolve(taggerData)
    
}

function secondsToTimestamp(input){
    var temp = new Date(input * 1000).toISOString().substr(11, 8);
    return temp
}

async function getTracklistFromDiscogs(discogsListingType, discogsListingCode){
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: "https://api.discogs.com/" + discogsListingType + 's/' + discogsListingCode,
            type: 'GET',
            contentType: "application/json", 
            success: function (data) {
                console.log('getTracklistFromDiscogs() successfull, data = ');
                console.log(data.tracklist);
                resolve(data.tracklist)
            },
            error: function (error) { // error callback 
              console.log('getTracklistFromDiscogs() ajax failed, error = ' + error);
              resolve("error")
            }   
          })
    }); 
  }

/*

~~~~~~~~~~~~~~~~~~~~ legacy code below ~~~~~~~~~~~~~~~~~~~~~~~

*/

//discogs api functions
async function taggerDotSite(input) {
    console.log("taggerDotSite().")
    //parse release id from url
    var index = input.indexOf("release/");
    var releaseID = input.substring(index + 8, input.length);

    //make post request to python function
    var csrftoken = getCookie('csrftoken');
    console.log("csrftoken = ")
    console.log(csrftoken)
    console.log("ajax time")
    document.getElementById("tracklist").innerHTML = ""
    let successValue = await makeAjax(releaseID, csrftoken);

    console.log("successValue = ", successValue)
    console.log("JSON.stringify(successValue) = ", JSON.stringify(successValue))
    //convert to json
    var successValueJson = JSON.parse(JSON.stringify(successValue));
    var tracklist = successValueJson['tracklist']
    console.log("successValueJson['tracklist'] = ", successValueJson['tracklist'])

    for (var i = 0; i < tracklist.length; i++) {
        console.log("i = ", i, ". ", tracklist[i])
        var node = document.createElement("LI");
        var textnode = document.createTextNode(tracklist[i]);
        node.appendChild(textnode);
        document.getElementById("tracklist").appendChild(node);
    }
    //document.getElementById("demo").innerHTML = successValue;

}

function makeAjax(dataVar, csrftoken) {
    console.log("making ajax for tagger discogs url, csrftoken = ", csrftoken, ". dataVar = ", dataVar)
    return new Promise(function (resolve, reject) {
        $.ajax({
            url: '/tagger/discogsURL',
            data: {
                csrfmiddlewaretoken: 'b2MsXtS0SVLNx2GWm55xFnUab9rhY4hw0cVws45rlejd6D6iDjK1I8jc4CEaRX6H',
                data: dataVar
            },
            headers: { 'ACookieAvailableCrossSite': 'SameSite=None' },
            dataType: 'json',
            success: function (msg) {
                console.log("ajax success, returning msg = " + msg)
                resolve(msg)
            }
        });


    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    console.log('cookieValue = ', cookieValue)
    return cookieValue;
}

function blah() {
    //document.getElementById("tracklist").innerHTML = htmlFinalTracklistView;
}

//file functions
$("#file").change(async function (e) {
    var file = e.currentTarget.files[0];
    var songs = e.currentTarget.files;
    var numberOfSongs = songs.length;
    var htmlFinalTracklistView = "";

    var startTime = "x"
    var endTime = "z"
    var startTimeSeconds = 0
    var endTimeSeconds = 0
    for (i = 0; i < numberOfSongs; i++) {
        let songLength = await getSongLength(songs[i], i);
        let songTitle = await getSongTitle(songs[i], i);
        console.log("i = ", i, ". songTitle = ", songTitle, ". songLength = ", songLength)

        var endTimeSeconds = startTimeSeconds + songLength

        //convert seconds to minutes 
        startTime = convertSecondsToTimestamp(startTimeSeconds);

        //convert seconds to minutes
        endTime = convertSecondsToTimestamp(endTimeSeconds);

        htmlFinalTracklistView = htmlFinalTracklistView + startTime + " - " + endTime + " " + songTitle + "<br>";

        var startTimeSeconds = endTimeSeconds
    }
    console.log("htmlFinalTracklistView = ")
    console.log(htmlFinalTracklistView)
    document.getElementById("tracklist").innerHTML = htmlFinalTracklistView;
    console.log("end of #file.change()");
});

function convertSecondsToTimestamp(seconds) {
    var duration = moment.duration(seconds, "seconds");
    var time = "";
    var hours = duration.hours();
    if (hours > 0) { time = hours + ":"; }
    var append_s = ""
    var append_m = ""
    if (duration.seconds() < 10) {
        append_s = "0"
    }
    if (duration.minutes() < 10) {
        append_m = "0"
    }
    total_string = time + append_m + duration.minutes() + ":" + append_s + duration.seconds();
    return total_string;
}

function getSongTitle(song, i) {
    return new Promise(function (resolve, reject) {

        var filename = song.name;
        var n = 0
        n = song.name.lastIndexOf(".")
        filename = filename.substr(0, filename.lastIndexOf("."))

        resolve(filename)
    });
}

function getSongLength(song, i) {
    return new Promise(function (resolve, reject) {
        //create objectURL and audio object for songs[i]
        objectURL = URL.createObjectURL(song);
        mySound = new Audio([objectURL])
        var filename = song.name;
        //when song metadata is loaded:
        mySound.addEventListener("canplaythrough", function (e) {
            var seconds = e.currentTarget.duration;
            resolve(seconds)
        });

    });
}
