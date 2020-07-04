// store API inside a link
//var link = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337"
var link ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
console.log(link);
// Get the geojson data from the link.
d3.json(link, function (data) {
  console.log(data),
  createFeatures(data);
});
// Create a GeoJSON layer containing the features array on the earthquakeData object
// Run the onEachFeature function once for each piece of data in the array
function createFeatures(earthquakeData) {
  function onEachLayer(feature) {
    return new L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      { radius: markerSize(feature.properties.mag),
        fillColor: fillcolor(feature.properties.mag),
        fillOpacity: 0.5,
        stroke: false,
      });
  }
 
  //Give each feature a popup description about the place and time 
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h1>" + feature.properties.place + "</h1><hr><p>" + new Date(feature.properties.time) +
      "</p><hr><p>" + feature.properties.mag + "</p>");
  }
  //Create a GeoJSON Layer which has the feature arrary
  //Run onEachFeature function for the earthquakes in the array
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: onEachLayer
  });
  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}
function createMap(earthquakes) {

  // Define streetmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 10,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });
  // Define darkmap layers
  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 10,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [37.7749, -122.4194],
    zoom: 10,
    layers: [streetmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  // creat a legend provide context for the map data
  var legend = L.control({ position: "topright" });
  // insert a div with a class of "legend"
  legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'legend'),
      magnitudes = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < magnitudes.length; i++) {
      div.innerHTML +=
        '<i style="background:' + fillcolor(i) + '"></i> ' +
        + magnitudes[i] + '<br>';
    }
    return div;
  };
  // Add the legend to the map
  legend.addTo(myMap);
}
 //Define color function
 function fillcolor(magnitude) {
  color = "";
  if (magnitude >= 5) {
    color = "red";
  }
  else if (magnitude >= 4) {
    color = "orange";
  }
  else if (magnitude >= 3) {
    color = "yellow";
  }
  else if (magnitude >= 2) {
    color = "yellowgreen";
  }
  else if (magnitude >= 1) {
    color = "green";
  }
  return color;
};
// Define makersize function
function markerSize(magnitude) {
  return magnitude*3;
}