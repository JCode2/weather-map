/**
 * Created by joshua on 2/3/17.
 */

//http://api.openweathermap.org/data/2.5/weather   http://api.openweathermap.org/data/2.5/forecast?id={}
function getLocal(latitude, longitude) {
    $.get("//api.openweathermap.org/data/2.5/forecast/daily", {
        APPID: "eda54ecfd2dc648ab68ecd44ce9ecf27",
        lat: latitude,
        lon: longitude,
        units: "imperial"
    }).done(function (data) {
        console.log(data);
        $("#location").html("<div class='col-md-4 col-sm-12'><h3 style='color: cadetblue'>Today in " + data.city.name + " " + data.city.country+ "</h3>" + "<img src='//openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png'>" + " <h4>Temperature: " + data.list[0].temp.day + " F</h4>" + " <h4> Morning: " + data.list[0].temp.morn + " F</h4>" + " <h4> Evening: " + data.list[0].temp.eve + " F" + "</h4></div>" +
            "<div class='col-md-4 col-sm-12'><h3 style='color: cadetblue'>Tomorrow</h3>" + "<img src='//openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png'>" + "Temperature: " + data.list[1].temp.day + " F" + " <h4> Morning: " + data.list[1].temp.morn + " F</h4>" + " <h4> Evening: " + data.list[1].temp.eve + " F" + "</h4></div>" +
            "<div class='col-md-4 col-sm-12'><h3 style='color: cadetblue'>Following Day</h3>" + "<img src='//openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png'>" + "Temperature: " + data.list[2].temp.day + " F" + " <h4> Morning: " + data.list[2].temp.morn + " F</h4>" + " <h4> Evening: " + data.list[2].temp.eve + " F" + "</h4></div>");
    });
}
//Auto complete search box//
function initAutocomplete() {
    var mapOptions = {
        // Set the zoom level
        zoom: 10
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);
    var address = "San Francisco, CA 94101";
    //geocoder
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({"address": address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var location = results[0].geometry.location;
            console.log(results);
            map.setCenter(location);
            getLocal(location.lat(), location.lng());
        } else {
            alert("Geocoding was not successful - STATUS: " + status);
        }
    });
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            getLocal(place.geometry.location.lat(), place.geometry.location.lng());
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
        //getLocal(map);
    });
}
