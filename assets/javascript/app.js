// ========== API Keys ==========
const googleAPIkey = 'AIzaSyB3_355xgTrbvLb3K_FE_2bpig4WBtCGgM';
const charityAPIkey = '3ea2f1ef16ab9b240050c2cf1c055650';
// ========== Hamburger Nav Functionality ==========
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}
// ========== Page Load Map Centered on User Location ==========
function initMapStart() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 41.8781, lng: -87.6298 },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;

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
// ========== On Click Function ==========
$("#find-charity").click(function () {
    event.preventDefault();
    $("#displayDiv").empty();
    // ========== CORS Fix ==========
    jQuery.ajaxPrefilter(function (options) {
        if (options.crossDomain && jQuery.support.cors) {
            options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
        }
    });
    // ========== Query Variables ==========
    let city = "&city=" + $("#city-input").val().trim();
    let state = "&state=" + $("#state-input").val().trim();
    let zip = "&zipCode=" + $("#zip").val().trim();
    let searchTerm = "&searchTerm=" + $("#searchTerm").val().trim();
    // ========== Query URL ==========
    let queryURL = "http://data.orghunter.com/v1/charitysearch?user_key=" + charityAPIkey + "&eligible=1&rows=21" + city + state + zip + searchTerm;
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
                missionStatement: response.data[i].missionStatement,
                url: response.data[i].url,
                donationUrl: response.data[i].donationUrl,
                location: response.data[i].city + ', ' + response.data[i].state,
                latitude: response.data[i].latitude,
                longitude: response.data[i].longitude
            }
            // ========== MVP Display ==========
            $('#displayDiv').append('<div class="card" style="width: 18rem;">' +
                '<div class="card-header">' + response.data[i].charityName + '</div>'
                + '<ul class="list-group list-group-flush">'
                + '<li class="list-group-item">' + '<a href=' + response.data[i].url + '>' + 'Get Info</a>' + '</li>'
                + '<li class="list-group-item">' + '<a href=' + response.data[i].donationUrl + '>' + 'Donate</a>' + '</li>'
                + '<li class="list-group-item">' + response.data[i].city + ', ' + response.data[i].state + ' ' + response.data[i].zipCode + '</li>'
                + ' <li class="list-group-item">' + response.data[i].missionStatement + '</li>'
                + '</ul>'
                + '</div>'
            );
            // ========== Charity Array Population ==========
            orgArray.push(orgObject);
        };
        initMap(orgArray);
    });
});
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.
let map, infoWindow;
function initMap(orgArray) {
    let searchLat = parseInt(orgArray[0].latitude);
    let searchLong = parseInt(orgArray[0].longitude);
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: searchLat, lng: searchLong },
        zoom: 6
    });
    infoWindow = new google.maps.InfoWindow;
    // ========== Google Maps API Marker Population ==========
    for (i = 0; i < orgArray.length; i++) {
        let myLatlng = new google.maps.LatLng(orgArray[i].latitude, orgArray[i].longitude);
        let marker = new google.maps.Marker({
            map: map,
            draggable: true,
            animation: google.maps.Animation.DROP,
            position: myLatlng,
            title: orgArray[i].name
        });
        // To add the marker to the map, call setMap();
        marker.setMap(map);
    };
}
