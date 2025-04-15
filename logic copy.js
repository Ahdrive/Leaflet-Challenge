// Create the 'basemap' tile layer that will be the background of our map.
// OPTIONAL: Step 2
// Create the 'street' tile layer as a second background of the map
let streets = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
let baseMaps = {
  "streets": streets
};

// Create the map object with center and zoom options.
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 3,
  layers: [streets]
});

// Then add the 'basemap' tile layer to the map.

// OPTIONAL: Step 2
// Create the layer groups, base maps, and overlays for our two sets of data, earthquakes and tectonic_plates.
// Add a control to the map that will allow the user to change which layers are visible.
let earthquake_data = new L.LayerGroup();
let tectonics = new L.LayerGroup();
let overlays = {
  "Earthquakes": earthquake_data,
  "Tectonic Plates": tectonics
};
L.control.layers(baseMaps, overlays).addTo(myMap);
// Make a request that retrieves the earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function (data) {

  // This function returns the style data for each of the earthquakes we plot on
  // the map. Pass the magnitude and depth of the earthquake into two separate functions
  // to calculate the color and radius.
  function styleInfo(feature) {
    return {
      color: getColor(feature.geometry.coordinates[2]),
      radius: getRadius(feature.properties.mag), //sets radius based on magnitude 
      fillColor: getColor(feature.geometry.coordinates[2]) //sets fillColor based on the depth of the earthquake
    }
  }

  // This function determines the color of the marker based on the depth of the earthquake.
  function getColor(depth) {
    if (depth <= 10) return "red";
    else if (depth > 10 & depth <= 25) return "orange";
    else if (depth > 25 & depth <= 40) return "yellow";
    else if (depth > 40 & depth <= 55) return "pink";
    else if (depth > 55 & depth <= 70) return "blue";
    else return "green";
  }

  // This function determines the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    return magnitude*5;
  }

  // Add a GeoJSON layer to the map once the file is loaded.
  L.geoJson(data, {
    // Turn each feature into a circleMarker on the map.
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng).bindPopup(feature.id); //function creates a circleMarker at latlon and binds a popup with the earthquake id
    },
    // Set the style for each circleMarker using our styleInfo function.
    style: styleInfo,
    // Create a popup for each marker to display the magnitude and location of the earthquake after the marker has been created and styled
    onEachFeature: function (feature, layer) {
      //return L.circleMarker(latlon).bindPopup(feature.id); //function creates a circleMarker at latlon and binds a popup with the earthquake id
    }
  // OPTIONAL: Step 2
  // Add the data to the earthquake layer instead of directly to the map.
  }).addTo(myMap);

  // Create a legend control object.
  let legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend");

    // Initialize depth intervals and colors for the legend
    div.innerHTML += "<h4>Depth Color Legend</h4>";
    div.innerHTML += '<i style="background: red"></i><span>(Depth < 10)</span><br>';
    div.innerHTML += '<i style="background: orange"></i><span>(10 < Depth <= 25)</span><br>';
    div.innerHTML += '<i style="background: yellow"></i><span>(25 < Depth <= 40)</span><br>';
    div.innerHTML += '<i style="background: pink"></i><span>(40 < Depth <= 55)</span><br>';
    div.innerHTML += '<i style="background: blue"></i><span>(55 < Depth <= 70)</span><br>';
    div.innerHTML += '<i style="background: green"></i><span>(Depth > 70)</span><br>';


    // Loop through our depth intervals to generate a label with a colored square for each interval.


    return div;
  };

  // Finally, add the legend to the map.
  legend.addTo(myMap);

  // OPTIONAL: Step 2
  // Make a request to get our Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (plate_data) {
    // Save the geoJSON data, along with style information, to the tectonic_plates layer.
    // Then add the tectonic_plates layer to the map.
    console.log(data);
    let features = data.features;
    console.log(features);

    //let results = features.filter(id => id.id == "nc73872510"); //replace the id string with the argument of the function once created
    let results = features;
    let first_result = results[0];
    console.log("================");
    console.log(first_result);
    console.log("================");
    let geometry = first_result.geometry;
    console.log(geometry);
    let coordinates = geometry.coordinates;
    console.log(coordinates);
    console.log(coordinates[0]); // longitude
    console.log(coordinates[1]); // latitude
    console.log(coordinates[2]); // depth of earthquake
    let magnitude = first_result.properties.mag;
    console.log(magnitude);
    //define depth variable
    let depth = geometry.coordinates[2];
    console.log(depth);
    let id = first_result.id;
    console.log(id);

  });
});
