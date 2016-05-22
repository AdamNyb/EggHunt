
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


// initializes the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: newPlace,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID, // sets the map type
    disableDefaultUI:true
  });
  map.setTilt(45);


  //initialPosition();
  
}
var initialPosition = function() {
  //console.log('initialPosition()')
  if (navigator.geolocation){

    navigator.geolocation.getCurrentPosition(
      function(position){
        initialPos = {
          lat: position.coords.latitude,
          lng : position.coords.longitude
        }
        
      });
        //console.log('kör createPlayerMarker')
        createPlayerMarker(initialPos);
  }
}

var createPlayerMarker=function(initialPos){
  //console.log('creating initial marker')
  marker = new google.maps.Marker({
    position: initialPos,
    map: map,
    title: 'Your position',
    animation: google.maps.Animation.DROP,
    icon: 'img/locationMarker.png'
  });
}

//EMMAS FIL
// not being used
// var initialPosition = function() {
//   console.log('initialPosition()')
//   if (navigator.geolocation){

//     navigator.geolocation.getCurrentPosition(
//       function(position){
//         initialPos = {
//           lat: position.coords.latitude,
//           lng : position.coords.longitude
//         }
        
//       });
//         console.log('kör createPlayerMarker')
//         createPlayerMarker(initialPos);
//   }
// }

// not being used
// var createPlayerMarker=function(initialPos){
//   console.log('creating initial marker')
//   marker = new google.maps.Marker({
//     position: initialPos,
//     map: map,
//     title: 'Your position',
//     animation: google.maps.Animation.DROP,
//     icon: 'img/locationMarker.png'
//   });

  
// }


var startButt = document.getElementById("startButt");
var usrAlias = document.getElementById("usrAlias");
var startGame = true;


startButt.addEventListener('click', function(){
  getLocation();
  usrAlias = String(usrAlias.value);

  // doesn't start the game until the uuid is set
  setNewUUID(usrAlias, function(){
    //console.log("CALLBACKKKKK!!!!!");
    pubnub_data.history({
          channel: gameCtrlChannel,
          count: 1,
          callback: function(history) {
            // controls if the game is already started, if so, don't start a new one
            console.log("YOYO, let's see if the game is already started", history[0][0].text);
            if (history[0][0].text == "gameStarted") {
              pubnub_data.history({
                channel: eggChannel,
                count: 1, 
                callback: function(history) {
                  console.log("The game is started",history[0][0].text);
                  console.log("Let's try to place the eggs");
                  var eggPos = history[0][0].text;
                  if (eggPos != "newGame") {
                    placeEggs(eggPos);
                  }
                }
              })
              //publish("startNewGame",gameCtrlChannel);
            } else {
              publish("startNewGame",gameCtrlChannel);
            }
          }
        });
  });


  if (startGame === true) { //make button clickable and stuff
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