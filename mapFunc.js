function createEggs(){
  // creates eggs
  randomPositions = randomEggs();
  for (var i = 0; i < randomPositions.length; i ++) {
    eggName = "egg" + String(i);
    //creates Google maps markers for each of the eggs
    var egg = new google.maps.Marker({
      position: {lat: randomPositions[i][0], lng: randomPositions[i][1]},
      map: map,
      title: eggName,
      animation: google.maps.Animation.DROP,
      icon: 'img/egg-app-icon.gif',
    });
    eggs.push(egg);
    eggData.push(egg.title, [egg.position.lat(), egg.position.lng()]);
  }
  
  publish(eggData, eggChannel); //publishes egg title and position to eggChannel(pubnub)
}


function placeEggs(eggPositions){
  //places already created eggs on map and store in variables "eggs" and "eggData"
  for (var i = 0; i < eggPositions.length; i +=2) {
    eggName = eggPositions[i];
    //creates Google maps markers for each of the eggs
    var egg = new google.maps.Marker({
      position: {lat: eggPositions[i+1][0], lng: eggPositions[i+1][1]},
      map: map,
      title: eggName,
      animation: google.maps.Animation.DROP,
      icon: 'img/egg-app-icon.gif',
    });
    eggs.push(egg);
    eggData.push(egg.title, [egg.position.lat(), egg.position.lng()]);
  }
}

var randomEggs = function() {
  //calculates different lat/lng within radius and returns a list
  // of positions
  randomPositions = [];
  for (var i = 0; i < 7; i ++) {
    var r = 50/111300, // = 50 meter radius
        y0 = 59.347451,
        x0 = 18.073773,
        u = Math.random(),
        v = Math.random(),
        w = r * Math.sqrt(u),
        t = 2 *  Math.PI * v,
        x = w * Math.cos(t),
        y1 = w * Math.sin(t),
        x1 = x / Math.cos(y0)
        newY = y0 + y1
        newX = x0 + x1
        randomPositions.push([newY, newX])
  }
  return randomPositions;
}


var getLocation = function(){
  //används den här markern???
  marker = new google.maps.Marker({
    position: null,
    map: map,
    title: 'Your position',
    animation: google.maps.Animation.DROP,
    icon: 'img/locationMarker.png'
  });
  

  if (navigator.geolocation){
    //if geolocation available, watchPosition for continous updating of position marker
    navigator.geolocation.watchPosition(
      function(position){
        var currentPos = {
          lat: position.coords.latitude,
          lng : position.coords.longitude
        };
        updatePlayerMarker(currentPos);
        publish(currentPos,positionChannel); //updates positionChannel
       
        getEggs(); //gets all the eggs that are not taken already
        
        userDistance(position.coords.latitude, position.coords.longitude); //initates check for user distance to egg
      }
    )
  }
}

var checkForEggs = function(remainingEggs) {
  //checks "eggs" (list) for remaining eggs, compares those eggs to the remaining 
  // eggs in eggChannel, removes any egg in "eggs" that is not in "remainingEggs"
  for (i = 0; i < eggs.length; i++){
    if (eggs[i] != "null"){
      var currEgg = eggs[i];
      var currEggName = currEgg.title;

      if (remainingEggs.indexOf(currEggName) == -1) {
        currEgg.setMap(null);
        eggs.splice(i, 1, "null");
        eggData.splice(i, 1, "null");
      }
    }
  }
}

var updatePlayerMarker = function(currentPos) {
  marker.setPosition(currentPos);
}

var rad = function(x) {
  return x * Math.PI / 180;
};

var userDistance = function(userLat, userLng) {
  //middle step before getting distance to egg, checks for each egg in "eggs"-list
  // calls getDistance to determine distance to said egg
  for (var j = 0; j < eggs.length; j ++) {
    if(eggs[j] !== "null"){
      var eggLat = eggs[j].position.lat();
      var eggLng = eggs[j].position.lng();
      var eggTitle = eggs[j].title; //egg "object" in eggs that is chosen
      getDistance(userLat, userLng, eggLat, eggLng, eggTitle);
    
    }
  }
};


var getDistance = function(userLat, userLng, eggLat, eggLng, eggTitle) {
  //checks if user's distance to egg is less than 10m, if so, calls on various
  // actions
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(eggLat - userLat);
  var dLong = rad(eggLng - userLng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(userLat) * Math.cos(rad(eggLat))) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;
  if (distance < 10) {
    removeEgg(eggTitle); //removes egg from "eggs" and "eggData" for the user who took the egg
    updateMyScore() //updates score with +1 after taken egg
    vibrate(); //makes phone vibrate when egg is taken
  }
}
var count = 3;

var countDown = function (){
  //count down from 3 to 0 when game is started
  document.getElementById("waitingForPlayers").outerHTML = "";
  var countInterval = setInterval(function(){
    //console.log(count);
    if(count > -1) {
      document.getElementById("countDown").innerHTML = count;
      count = count - 1;
    }
    else{
      document.getElementById("countDown").innerHTML = "";
      document.getElementById("startScreen").setAttribute("style", "all: initial;*{all: unset;}");

      document.getElementById("map").setAttribute("style", "z-index:2;position: relative;overflow: hidden;transform: translateZ(0px);background-color: rgb(229, 227, 223);display:block");
      document.getElementById("gameUI").setAttribute("style", "display:block");
      clearInterval(countInterval);//stop the loop
    }
  }, 1000);
};

var vibrate = function(){
  //vibrates phone to indicate that you took the egg
  if (navigator.vibrate) {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    navigator.vibrate(1000)
 
}
};
