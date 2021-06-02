const socket = new WebSocket("ws://localhost:3001/");

socket.onopen = (event) => {
  console.log("open");
};

socket.onmessage = (event) => {
  // targetInput.value = event.data;
};

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api?orogin=http://localhost:3000";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var vid;
var list;

$(document).ready(function () {
    let roomUrl = location.href.substr(location.href.lastIndexOf("@")+1);
    let temp = location.href.split("?"); 
    let data=temp[1].split("@"); 
    let username = data[0]; 
    let roomName = data[1];

    username = decodeURI(username);
    roomName = decodeURI(roomName);
    roomUrl = decodeURI(roomUrl);
    if(roomUrl.indexOf('playlist') != -1){
        vid = temp[2].substr(5);
        list = 1;
        console.log(vid);
    }else{
        vid = roomUrl.substr(
            roomUrl.lastIndexOf('/') + 1
            );
        console.log(vid);
        
    }
    
    //username(방장), roomName(만든 방 이름), roomUrl(선택한 url), vid 중 필요한 정보 서버로 보냄.
    //서버에서 접속한 사람수(클라이언트수+1) 가져옴.
    let person = 4; //예시 
    person = "("+person + "명이 방에 있습니다)";
    document.querySelector('#mainRoom_p_2').innerHTML = person;

    document.querySelector('#mainRoom_p_1').innerHTML =  `<strong>"${roomName}"</strong> 방`;

});


// 3. This function creates an <iframe> (and YouTube player)
        // after the API code downloads.
        var player;
        function onYouTubeIframeAPIReady() {
          if(list == 1){
            player = new YT.Player("player", {
              height: "360",
              width: "640",
              playerVars: {
                listType:'playlist',
                list: vid
              },
              events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
              },
            });
          }else{
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
