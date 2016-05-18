
// some locations
var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.346667, lng: 18.0702473};
var newPlace = {lat: 59.3475983, lng: 18.073206};
var map;
var eggs = [];
var eggTitles = [];


// initializes the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: newPlace,
    zoom: 17,
    mapTypeId: google.maps.MapTypeId.HYBRID, // sets the map type
    disableDefaultUI:true
  });
  map.setTilt(45);


  // creates the other controls
  createEggs();
  userDistance(59.3475983, 18.073206);

}

// creates markers
function createEggs(){
  randomPositions = randomEggs();

  //markers = [];
  //console.log("eggs", eggs);
  for (i = 0; i < randomPositions.length; i ++) {
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
    eggTitles.push(egg.title);

  }
  //console.log("eggs", eggs);
  publish(eggTitles, eggChannel);
}

var randomEggs = function() {
  randomPositions = [];
  for (i = 0; i < 7; i ++) {
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
  console.log("random", randomPositions); 
  return randomPositions;
}

 var getLocation = function(){
        if (navigator.geolocation){
          navigator.geolocation.getCurrentPosition(
            function(position){
              var currentPos = {
                lat: position.coords.latitude,
                lng : position.coords.longitude

              };

              console.log('abc'+currentPos)
              return currentPos;
            }/*,
            function(error){
              console.log('Error: ',error);
            }*/)
        }
      }

var rad = function(x) {
  return x * Math.PI / 180;
};

function userDistance(userLat, userLng) {
  //console.log("userDistanceMarkers", markers);
  //for (i = 0; i < userPositions.length; i++) {
  //console.log("markers[i]", markers[i].position.lat());
  console.log("egglängd", eggs.length);
  for (j = 0; j < eggs.length; j ++) {
    console.log("userDistance");
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
  console.log("distance:", distance);

  if (distance < 10) {
    console.log("SHORT DISTANCE!!!");
    console.log("egg title", eggTitle);
    removeEgg(eggTitle);
  }

  //var distance = getDistance(sq1Lat, sq1Lng, sq2Lat, sq2Lng).toFixed(2)
  //return distance; // returns the distance in meter
};

//decideDistance, for user position {for egg position}

getLocation();

var startButt = document.getElementById("startButt");
var usrAlias = document.getElementById("usrAlias");
startButt.addEventListener('click', function(){
  usrAlias = String(usrAlias.value);
  if (usrAlias == "") {
    usrAlias = 'Eggbert';
  }
  document.getElementById("map").setAttribute("style", "z-index:2;position: relative;overflow: hidden;transform: translateZ(0px);background-color: rgb(229, 227, 223);");
  document.getElementById("gameUI").setAttribute("style", "display:block");
  console.log(usrAlias);
  game(usrAlias);
});