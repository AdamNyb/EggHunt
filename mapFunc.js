// creates eggs
function createEggs(){
  randomPositions = randomEggs();

  //markers = [];
  //console.log("eggs", eggs);
  for (var i = 0; i < randomPositions.length; i ++) {
    eggName = "egg" + String(i);
    var egg = new google.maps.Marker({
      position: {lat: randomPositions[i][0], lng: randomPositions[i][1]},
      map: map,
      title: eggName,
      animation: google.maps.Animation.DROP,
      icon: 'img/egg-app-icon.gif',
    });
    //console.log("one egg title", egg.title);
    eggs.push(egg);
    eggData.push(egg.title, egg.position);

  }
  //console.log("eggs", eggs);
  publish(eggData, eggChannel);
}


function placeEggs(eggPositions){
  console.log("placeEggs()");
  //markers = [];
  console.log("My eggdata (in place eggs)", eggPositions);
  for (var i = 0; i < eggPositions.length; i +=2) {
    //console.log(eggData[i]);
    //console.log(eggData[i+1].lat);
    eggName = eggPositions[i];
    var egg = new google.maps.Marker({
      position: {lat: eggPositions[i+1].lat, lng: eggPositions[i+1].lng},
      map: map,
      title: eggName,
      animation: google.maps.Animation.DROP,
      icon: 'img/egg-app-icon.gif',
    });
    //console.log("one egg title", egg.title);
    eggs.push(egg);
    eggData.push(egg.title, egg.position);

  }
  //console.log("eggs", eggs);
  //publish(eggData, eggChannel);
}

var randomEggs = function() {
  randomPositions = [];
  for (var i = 0; i < 7; i ++) {
    var r = 150/111300, // = 100 meters
        y0 = 59.3475983,
        x0 = 18.073206,
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
  //console.log("random", randomPositions); 
  return randomPositions;
}


var getLocation = function(){
  //console.log('getLocation()');

  //console.log('creating user marker');
  marker = new google.maps.Marker({
    position: null,
    map: map,
    title: 'Your position',
    animation: google.maps.Animation.DROP,
    icon: 'img/locationMarker.png'
  });
  

  if (navigator.geolocation){
    navigator.geolocation.watchPosition(
      function(position){
        var currentPos = {
          lat: position.coords.latitude,
          lng : position.coords.longitude
        };

        
        updatePlayerMarker(currentPos);
        //console.log('currentPos:')
        //console.log(currentPos)

        publish(currentPos,positionChannel);
       
        //return currentPos;
        userDistance(position.coords.latitude, position.coords.longitude);
      }/*,
      function(error){
        console.log('Error: ',error);
      }*/
    )
  }
}

var updatePlayerMarker = function(currentPos) {
  //console.log("updatePlayerMarker()");
  //console.log("currentPos", currentPos);
  marker.setPosition(currentPos);
}

var rad = function(x) {
  return x * Math.PI / 180;
};

var userDistance = function(userLat, userLng) {
  //console.log("userDistanceMarkers", markers);
  //for (i = 0; i < userPositions.length; i++) {
  //console.log("markers[i]", markers[i].position.lat());
  //console.log("egglängd", eggs.length);
  for (var j = 0; j < eggs.length; j ++) {
    //console.log("userDistance");
    var eggLat = eggs[j].position.lat();
    var eggLng = eggs[j].position.lng();
    
    var eggTitle = eggs[j].title; //egg "object" in eggs that is chosen
    getDistance(userLat, userLng, eggLat, eggLng, eggTitle);
    
  }
  //}
};


var getDistance = function(userLat, userLng, eggLat, eggLng, eggTitle) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(eggLat - userLat);
  var dLong = rad(eggLng - userLng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(userLat) * Math.cos(rad(eggLat))) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c;
  if (distance < 15) {
    //console.log("SCOOOOORE!!!");
    //console.log("egg title", eggTitle);
    removeEgg(eggTitle);
    vibrate();
  }
  //console.log("distance:", distance);
}
var count = 3;

var countDown = function (){
  document.getElementById("waitingForPlayers").outerHTML = "";
  var countInterval = setInterval(function(){
    console.log(count);
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
  if (navigator.vibrate) {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    navigator.vibrate(1000)
 
}


  //var distance = getDistance(sq1Lat, sq1Lng, sq2Lat, sq2Lng).toFixed(2)
  //return distance; // returns the distance in meter
};
