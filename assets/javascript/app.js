// ========== API Keys ==========
const googleAPIkey = 'AIzaSyB3_355xgTrbvLb3K_FE_2bpig4WBtCGgM';
const charityAPIkey = '3ea2f1ef16ab9b240050c2cf1c055650';
// ========== CORS Fix ==========
jQuery.ajaxPrefilter(function (options) {
    if (options.crossDomain && jQuery.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});
// ========== Query Variables ==========
// let charityName = "&charityName=" + $("#charityName").val().trim();
// let city = "&city=" + $("#city-input").val().trim();
// let zip = "&zipCode=" + $("#zip").val().trim();
// let searchTerm = "&searchTerm=" + $("#searchTerm").val().trim();
// ========== Query URL ==========
let queryURL = "http://data.orghunter.com/v1/charitysearch?user_key=" + charityAPIkey + "&eligible=1&" + charityName + city + zip + searchTerm;
// ========== Charity Ajax Call ==========
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function (response) {
    let orgArray = [];
    for (i = 0; i < response.data.length; i++) {
        // ========== Charity Geolocation Object ==========
        const orgObject = {
            name: response.data[i].charityName,
            url: response.data[i].url,
            donationUrl: response.data[i].donationUrl,
            location: response.data[i].city + ', ' + response.data[i].state,
            latitude: response.data[i].latitude,
            longitude: response.data[i].longitude
        }
        // ========== MVP Display ==========
        $('#displayDiv').append('==============================' + '<br>'
            + 'Charity: ' + response.data[i].charityName +
            '<br>' + '<a href=' + response.data[i].url + '>' + 'Get Info</a>' +
            '<br>' + '<a href=' + response.data[i].donationUrl + '>' + 'Donate</a>' +
            '<br>' + 'Location: ' + response.data[i].city + ', ' + response.data[i].state +
            '<br>' + 'Mission Statement: ' + response.data[i].missionStatement +
            '<br>');
        // ========== Charity Array Population ==========
        orgArray.push(orgObject);
    };
    console.log('========== Org Array ==========');
    console.log(orgArray);
    initMap(orgArray);
});
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
var map, infoWindow;
function initMap(orgArray) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;
    // ========== Google Maps API Marker Population ==========
    for (i = 0; i < orgArray.length; i++) {
        let myLatlng = new google.maps.LatLng(orgArray[i].latitude, orgArray[i].longitude);
        let marker = new google.maps.Marker({
            position: myLatlng,
            title: orgArray[i].name
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
    };
    // ========== Try HTML5 geolocation ==========
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
}
// ========== Google API Geolocation Error Handling (DO NOT TOUCH) ==========
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser does not support geolocation.');
    infoWindow.open(map);
}
