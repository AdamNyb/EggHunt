
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
  
}

//decideDistance, for user position {for egg position}

//getLocation();

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
  //game(usrAlias);
  setNewUUID(usrAlias);
  createEggs();
});