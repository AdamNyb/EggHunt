// some locations
var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.346667, lng: 18.0702473};
var newPlace = {lat: 59.3475983, lng: 18.073206};
var map;


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
  createMarkers();
}

// creates markers
function createMarkers(){
  randomPositions = randomMarkers();
  markers = [];
  console.log("markers", markers);
  for (i = 0; i < randomPositions.length; i ++) {
    marker = "marker" + String(i);
    var marker = new google.maps.Marker({
      position: {lat: randomPositions[i][0], lng: randomPositions[i][1]},
      map: map,
      title: 'Not draggable!',
      animation: google.maps.Animation.DROP,
      icon: 'img/egg-app-icon.gif',
      found: false
    });
    markers.push(marker);
  }
  console.log("markers", markers);
}

var randomMarkers = function() {
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

var getDistance = function(p1Lat, p1Lng, p2Lat, p2Lng) {
  var R = 6378137; // Earth’s mean radius in meter
  var dLat = rad(p2Lat - p1Lat);
  var dLong = rad(p2Lng - p1Lng);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(rad(p1Lat) * Math.cos(rad(p2Lat))) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  var distance = getDistance(sq1Lat, sq1Lng, sq2Lat, sq2Lng).toFixed(2)
  return distance; // returns the distance in meter
  };

getLocation()