            let userlat;
            let userlong;
            var username;
            var roomName;
            var vid;
            var list;
            var player;
            var roomUrl;

            $(document).ready(function () {

                let params = location.href.substr(location.href.lastIndexOf('?') + 1).split('@');
                username = decodeURI(params[0]);
                userlat = decodeURI(params[1]);
                userlong = decodeURI(params[2]);
                
                document.querySelector('#total_div').innerHTML = '<div id="main_div"><div id="main_div_1"><p id="main_p_1"></p></div><div id="main_div_2"><p id="main_p_2">방 만들기</p><button id="main_btn_1" onclick="goMakeRoom()">만들기</button></div><div id="main_div_3"><p id="main_p_3">방 찾기</p><button id="main_btn_2" onclick="showList()">방 리스트 보기</button></div></div>'
                document.querySelector('#main_p_1').innerHTML = `<strong>"${username}"</strong>님 환영합니다!`
                
            });
             

            function showList(){

                let params = location.href.substr(location.href.lastIndexOf('?') + 1).split('@');
                username = decodeURI(params[0]);
                userlat = decodeURI(params[1]);
                userlong = decodeURI(params[2]);
                
                //서버로부터 방 정보가 담긴 json 데이터 요청
                
                let req = `http://localhost:3000/roomList?userlat=${userlat}&userlong=${userlong}`;

                fetch(req) 
                .then(function(res){
                    return res.json();
                })
                .then(function(json){
                    let rooms = json;       //rooms: 방 객체들의 array
                    printlist(rooms);
                })
                .catch(function(err){
                    console.log('Fetch problem: '+err.message);
                });
            };
            
            function printlist(rooms){
                for(let i = 0; i < rooms.length; i++){
                    let distance = computeDist(userlat, userlong, rooms[i].hostlat, rooms[i].hostlong)
                    //console.log("i: "+distance);
                    if (distance <= 100){
                        let room = createNew(i, rooms[i].roomName, rooms[i].numOfPeople, distance);
                        document.querySelector('#main_div_3').appendChild(room);
                    }
                }
            }
            function computeDist(userlat, userlong, hostlat, hostlong){
                let dist = Math.acos(Math.sin(userlat)*Math.sin(hostlat) +
                        Math.cos(userlat)*Math.cos(hostlat)*Math.cos(userlong-hostlong))*6371;
                
                return dist*1000;
            }

            function createNew(i, rn, rpn, rd){
                const newRoom = document.createElement("div");
                const roomN = document.createElement("p");
                const roomPN = document.createElement("p");
                const roomD = document.createElement("p");
                const roomB = document.createElement("btn");
                roomB.classList.add('roomB');
                roomB.innerHTML = "입장";
                roomB.onclick = goSubRoom;

                let rpn2 = rpn + "명";
                let rd2 = Math.round(rd) + "m";


                roomN.textContent = rn;
                roomPN.textContent = rpn2;
                roomD.textContent = rd2;

                roomN.classList.add('roomN');
                roomPN.classList.add('roomPN');
                roomD.classList.add('roomD');

                newRoom.appendChild(roomN);
                newRoom.appendChild(roomPN);
                newRoom.appendChild(roomD);
                newRoom.appendChild(roomB);
                newRoom.classList.add('newRoom');

                return newRoom;

            function goSubRoom(){
                    document.querySelector('#total_div').innerHTML = '<div id="subRoom_div"><p id="subRoom_p_1"></p><p id="subRoom_p_2"></p><div id="player"></div></div>'
                    roomName = rn;
                    
                    var tag = document.createElement("script");

                    tag.src = "https://www.youtube.com/iframe_api?orogin=http://localhost:3000";
                    var firstScriptTag = document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    
                
                    document.querySelector('#subRoom_p_1').innerHTML = `<strong>"${roomName}"</strong> 방`;
                    roomUrl = "https://youtu.be/MwYq4vAH7bI" //예시:그냥 동영상

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

                    

                }
                
            }




            function goMakeRoom(){
                document.querySelector('#total_div').innerHTML = '<div id="makeRoom_div"><p id="makeRoom_p_1"></p><p id="makeRoom_p_2">방 이름 :</p><input id="makeRoom_input_1" name = "roomname" type = "text" size = 10 placeholder = "컴과 MT" autofocus autocomplete="on" required/><p id="makeRoom_p_3">Youtube 동영상(재생목록) url :</p><input id="makeRoom_input_2" name = "roomurl" type = "text" placeholder = "https://youtu.be......" required/><button id="makeRoom_btn_1" onclick="goMainRoom()">생성</button></div>'
                document.querySelector('#makeRoom_p_1').innerHTML = `<strong>"${username}"</strong>님이 만들 방`
            }


            function goMainRoom(){
                
                roomName = document.querySelector('#makeRoom_input_1').value;
                roomUrl = document.querySelector('#makeRoom_input_2').value;

                document.querySelector('#total_div').innerHTML = '<div id="mainRoom_div"><p id="mainRoom_p_1"></p><p id="mainRoom_p_2"></p><div id="player"></div></div>'
                

                var tag = document.createElement("script");

                    tag.src = "https://www.youtube.com/iframe_api?orogin=http://localhost:3000";
                    var firstScriptTag = document.getElementsByTagName("script")[0];
                    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                    
                
                    document.querySelector('#mainRoom_p_1').innerHTML =  `<strong>"${roomName}"</strong> 방`;
                    roomUrl = "https://youtu.be/MwYq4vAH7bI" //예시:그냥 동영상

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
            }

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

            
        





