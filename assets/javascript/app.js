// ========== API Keys ==========
const googleAPIkey = 'AIzaSyB3_355xgTrbvLb3K_FE_2bpig4WBtCGgM';
const charityAPIkey = '3ea2f1ef16ab9b240050c2cf1c055650';
// ========== API Keys ==========
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap() {
    var myLatLng = { lat: 41.8781, lng: -87.6298 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: myLatLng,
        zoom: 6
    });
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        title: 'Hello World!'
    });
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
};
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
};
// ========== Charity Ajax Call ==========
// let queryURL = "http://data.orghunter.com/v1/charitysearch?user_key=" + charityAPIkey; + "&eligible=1"

// $.ajax({
//   url: queryURL,
//   method: "GET"
// }).then(function(response) {
//   console.log(response);
// });