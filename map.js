// some locations
var Sthlm = {lat: 59.332595, lng: 18.065193};
var Sthlm2 = {lat: 59.329339, lng: 18.068701};
var KTH = {lat: 59.349877, lng: 18.070535};
var squirtlePos1 = KTH;
var squirtlePos2 = {lat: 59.361162, lng: 18.034083};
var map;
var squirtleMark1;
var squirtleMark2;

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
  createDirectionCtrls();
  createZoomCtrls();
  createOtherCtrls();
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
  squirtleMark1 = new google.maps.Marker({
    position: squirtlePos1,
    map: map,
    title: 'You found Squirtle!',
    icon: 'squirtleMark1.gif',
    animation: google.maps.Animation.DROP
  });
  squirtleMark2 = new google.maps.Marker({
    position: squirtlePos2,
    map: map,
    title: 'You found Squirtle!',
    draggable: true,
    icon: 'squirtleMark2.gif',
    animation: google.maps.Animation.DROP
  });
}
function createDirectionCtrls() {
  var up = document.getElementById('up');
  var left = document.getElementById('left');
  var right = document.getElementById('right');
  var down = document.getElementById('down');

  google.maps.event.addDomListener(down, 'click', function() {
    currentLat = map.center.lat();
    currentLng = map.center.lng();
    map.setCenter({lat: currentLat - 0.001, lng: currentLng});
  });
  google.maps.event.addDomListener(up, 'click', function() {
    currentLat = map.center.lat();
    currentLng = map.center.lng();
    map.setCenter({lat: currentLat + 0.001, lng: currentLng});
  });
  google.maps.event.addDomListener(right, 'click', function() {
    currentLat = map.center.lat();
    currentLng = map.center.lng();
    map.setCenter({lat: currentLat, lng: currentLng + 0.001});
  });
  google.maps.event.addDomListener(left, 'click', function() {
    currentLat = map.center.lat();
    currentLng = map.center.lng();
    map.setCenter({lat: currentLat, lng: currentLng - 0.001});
  });
}

function createZoomCtrls() {

  var zoomIn = document.getElementById('zoomIn');
  var zoomOut = document.getElementById('zoomOut');

  google.maps.event.addDomListener(zoomIn, 'click', function() {
    var newZoom = Number(map.zoom) + 1;
    map.setZoom(newZoom);
  });

  google.maps.event.addDomListener(zoomOut, 'click', function() {
    var newZoom = Number(map.zoom) - 1;
    map.setZoom(newZoom);
  });
}
function createOtherCtrls() {
  var squirtleButton = document.getElementById('squirtleLocation');

  google.maps.event.addDomListener(squirtleButton, 'click', function() {
    console.log("Where is Squirtle?");
    //map.setCenter(squirtlePos1); 
    map.panTo(squirtlePos2);
  });

  google.maps.event.addDomListener(squirtleMark2, 'dragend', function() {
    console.log("YO");
    //console.log(squirtleMark2.getPosition().lat());
    console.log(squirtleMark1.getPosition().lat());
    console.log(squirtleMark1.getPosition().lng());

    sq1Lat = squirtleMark1.getPosition().lat();
    sq1Lng = squirtleMark1.getPosition().lng();
    sq2Lat = squirtleMark2.getPosition().lat();
    sq2Lng = squirtleMark2.getPosition().lng();
    if (sq2Lat == sq1Lat && sq2Lng == sq1Lng ) {
      console.log("YEAHHH!");
    }
  });
}