// Fetch the earthquake data
const url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson";

// Create the map
let myMap = L.map("map", {
    center: [40, -100],
    zoom: 4
  });
//   39.7392° N, 104.9903° W for denver (middle)

// Adding a tile layer (the background map image) to our map:
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


function createLegend() {
    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");
        var depths = [0, 2, 6, 18, 25];
        var labels = [];

        div.innerHTML += "<h4>Depth (km)</h4>";

        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }
        return div;
    };

    legend.addTo(myMap);
}

function getColor(depth) {
    if (depth <= 0) return "white";
    else if (depth <= 2) return "lightgrey";
    else if (depth <= 6) return "lightgreen";
    else if (depth <= 18) return "lightyellow";
    else if (depth <= 25) return "orange";
    else return "red";
}

// __main__ - MAIN FUNCTION
d3.json(url).then(function(response) {
//log data
  console.log(response);
// create markers
    response.features.forEach(function(quake) {
        let coordinates = quake.geometry.coordinates;
        let magnitude = quake.properties.mag;
        let depth = coordinates[2];
        let date = new Date(quake.properties.time);
        let prettyTime = date.toLocaleString(); 
// marker info
        L.circleMarker([coordinates[1], coordinates[0]], {
            radius: magnitude * 3,
            fillColor: getColor(depth),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.6
            //popup
        }).bindPopup(`
            <h3>Magnitude: ${magnitude}</h3>
            <h3>Location: ${quake.properties.place}</h3>
            <h3>Depth: ${depth} km</h3>
            <h4>Time: ${prettyTime}</h4>
        `).addTo(myMap);
    });
//legend function
    createLegend();
});
