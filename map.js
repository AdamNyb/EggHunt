
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
var playerPositions = {};

var clickedOnButton = false;


// initializes the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: newPlace,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID, // sets the map type
    disableDefaultUI:true
  });
  map.setTilt(45);
  
}

var startButt = document.getElementById("startButt");
var usrAlias = document.getElementById("usrAlias");
var startGame = false;


startButt.addEventListener('click', function(){
  getLocation();
  usrAlias = String(usrAlias.value);

  clickedOnButton = true;

  if (startGame === true) { 

  // doesn't start the game until the uuid is set
  setNewUUID(usrAlias, function(){
    pubnub_data.history({
          channel: gameCtrlChannel,
          count: 1,
          callback: function(history) {
            // controls if the game is already started, if so, don't start a new one
            if (history[0][0].text == "gameStarted") {
              pubnub_data.history({
                channel: eggChannel,
                count: 1, 
                callback: function(history) {
                  var eggPos = history[0][0].text;
                  if (eggPos != "newGame") {
                    placeEggs(eggPos);
                  }
                }
              })
              
            } else {
              publish("startNewGame",gameCtrlChannel);
            }
          }
        });
  });


  //make button clickable and stuff
    //hide startscreen
    document.getElementById("startScreen").innerHTML = ''+
        '<div id="waiting">'+
          '<div>'+
            '<p id="waitingForPlayers">'+
              'Waiting for other players...'+
            '</p>'+
            '<p id="countDown"></p>'+
          '</div>'+
       '</div>';
    document.getElementById("waiting").setAttribute("style","display: table;width: 90%;top: 30%;position: fixed;z-index: 3;text-align: center;");
    countDown();

   

    playerReady = true;


  }
});