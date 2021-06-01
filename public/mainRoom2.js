var vid;

$(document).ready(function () {
    let temp = location.href.split("?"); 
    let data=temp[1].split("@"); 
    let username = data[0]; 
    let roomName = data[1];
    let roomUrl = data[2];

    username = decodeURI(username);
    roomName = decodeURI(roomName);
    roomUrl = decodeURI(roomUrl);
    if(roomUrl.indexOf('playlist') != -1){
        vid = temp[2].substr(5);
        vid = "videoseries?list=" + vid;
        console.log(vid);
    }else{
        vid = roomUrl.substr(
            roomUrl.lastIndexOf('/') + 1
            );
    }
    
    document.querySelector('#mainRoom2_p_1').innerHTML = `${roomName}`

});


var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api?orogin=http://localhost:3000";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "360",
    width: "640",
    videoId: vid,
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    },
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  console.log("start!!");
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

// player state 1: play 2: stop 3:

function onPlayerStateChange(event) {
  console.log("player state changed to ", event.data);
  const playerState = event.data;

  if (playerState === 1) {
    socket.send(JSON.stringify({
      type: "play",
      time: player.getCurrentTime()
    }))
  } else if (playerState == 2) {
    socket.send(JSON.stringify({
      type: "pause",
      time: player.getCurrentTime()
    }))
  } else if (playerState == 0) {
    socket.send(JSON.stringify({
      type: "stop",
      time: player.getCurrentTime()
    }))
  }
}

function stopVideo() {
  player.stopVideo();
}
