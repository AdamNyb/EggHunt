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

