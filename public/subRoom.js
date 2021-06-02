const socket = new WebSocket("ws://localhost:3001/");

socket.onopen = (event) => {
  console.log("open");
};

var tag = document.createElement("script");

tag.src = "https://www.youtube.com/iframe_api?orogin=http://localhost:3000";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var vid;
var list;

$(document).ready(function () {
    let temp = location.href.split("?"); 
    let data=temp[1].split("@"); 
    let username = data[0]; 
    let roomName = data[1];
    let roomPersonNum = data[2];
 
    username = decodeURI(username);
    roomName = decodeURI(roomName);
    roomPersonNum = decodeURI(roomPersonNum);
                
    document.querySelector('#subRoom_p_1').innerHTML = `<strong>"${roomName}"</strong> 방`;

    ////username(접속자), roomName(찾은 방 이름) 중 필요한 정보 서버로 보냄.
    //서버에서 접속한 사람수 가져옴.
    let person = 4; //예시 
    person = "("+person + "명이 방에 있습니다)";
    document.querySelector('#subRoom_p_2').innerHTML = person;

    //서버로부터 방장이 입력한 url 받아옴. 
    let roomUrl = "https://www.youtube.com/playlist?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG";  //예시:재생목록
    //let roomUrl = "https://youtu.be/MwYq4vAH7bI" //예시:그냥 동영상

    if(roomUrl.indexOf('playlist') != -1){
        vid = roomUrl.substr(roomUrl.indexOf("list=")+5);
        list = 1;
        console.log(vid);
    }else{
        vid = roomUrl.substr(
            roomUrl.lastIndexOf('/') + 1
            );
        console.log(vid);
        
    }
    

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

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data)
    player.seekTo(data.time)

    switch (data.type) {
        case 'play':
            player.playVideo()
            break;
        case 'pause':
            player.pauseVideo()
            break;
        case 'stop':
            player.stopVideo()
    }
};
