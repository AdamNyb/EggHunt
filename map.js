
// some locations
var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.346667, lng: 18.0702473};
var newPlace = {lat: 59.3475983, lng: 18.073206};
var map;
var eggs = [];
var eggData = [];
var marker;
var initialPos;
var readyPlayers = [];
var playerReady = false;
var gameStarted = false;


// initializes the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: newPlace,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID, // sets the map type
    disableDefaultUI:true
  });
  map.setTilt(45);


  initialPosition();
  
}

//decideDistance, for user position {for egg position}

//getLocation();

var startButt = document.getElementById("startButt");
var usrAlias = document.getElementById("usrAlias");
var startGame = true;


startButt.addEventListener('click', function(){
  usrAlias = String(usrAlias.value);
  /*if (usrAlias == "") {
    usrAlias = 'Eggbert';
  }*/
  //console.log(usrAlias);
  //game(usrAlias);

  setNewUUID(usrAlias, function(){
    console.log("CALLBACKKKKK!!!!!");
    // pubnub_data.history({
    //       channel: gameCtrlChannel,
    //       count: 1,
    //       callback: function(history) {
    //         if (history[0][0].text != "startNewGame") {
    //           publish("startNewGame",gameCtrlChannel);
    //         }
    //       }
    //     });
    publish("startNewGame",gameCtrlChannel);
  });

  getLocation();
  //console.log("YOYO POST TO READY CHANNEL");
  //var readyPlayers = [];
  

  if (startGame === true) { //make button clickable and stuff
    //hide startscreen
    document.getElementById("startScreen").innerHTML = "";
    document.getElementById("startScreen").setAttribute("style", "all: initial;*{all: unset;}");

    document.getElementById("map").setAttribute("style", "z-index:2;position: relative;overflow: hidden;transform: translateZ(0px);background-color: rgb(229, 227, 223);display:block");
    document.getElementById("gameUI").setAttribute("style", "display:block");

    //console.log(usrAlias);
    //game(usrAlias);
    //setNewUUID(usrAlias);
    //publish(scoreboard,scoreChannel);
    playerReady = true;

    // console.log("YO READY?!");
    // pubnub_data.history({
    //   channel: readyChannel,
    //   count: 1,
    //   callback: function(history) {
    //     console.log("READY HOSTPRYYYYYYYYYYYYY");
    //     console.log(history[0][0].text);
    //     if (history == undefined || history[0][0].text == "tom" || history[0][0] == undefined || history[0][0].text == undefined) {
    //       var readyPlayers = []
    //       readyPlayers.push(user.uuid);
    //       publish(readyPlayers,readyChannel);
    //     } else {
    //       readyPlayers = history[0][0].text;
    //       readyPlayers.push(user.uuid);
    //       publish(readyPlayers,readyChannel);
    //       console.log("Ready history: ",readyPlayers);
    //     }

    //   }
    // })

    //createEggs();
  }
});