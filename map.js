// some locations
var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.349877, lng: 18.070535};
var squirtlePos1 = KTH;
var squirtlePos2 = {lat: 59.361162, lng: 18.034083};
var map;

// initializes the map
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: Sthlm2,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.HYBRID, // sets the map type
    disableDefaultUI:true
  });
  map.setTilt(45);

  // creates the other controls
  createMarkers();
}

// creates markers
function createMarkers(){
  var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
  var marker1 = new google.maps.Marker({
    position: Sthlm,
    map: map,
    title: 'Not draggable!',
    animation: google.maps.Animation.DROP
  });
  var marker2 = new google.maps.Marker({
    position: Sthlm2,
    map: map,
    title: 'Draggable!',
    draggable: true,
    animation: google.maps.Animation.BOUNCE
  });
}

var getLocation = function(map){
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(
      function(position){
        var currentPos = {
          lat: position.coords.latitude,
          lng : position.coords.longitude

        };
        map.setCenter(currentPos);
        console.log(lat)
        return currentPos;
      }/*,
      function(error){
        console.log('Error: ',error);
      }*/)
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
  return distance// returns the distance in meter
};


