(function() {
    // read in zip code geojson file for boundary map
    Promise.all([
        d3.json("./Zipcodes_Poly.geojson")
        //d3.json("./numberOfVehiclesHousehold_ZipCode.json"),
        //d3.json("./meansOfTransporation_ZipCode.json")
    ]).then((data) => {
        const zipcodes_poly = data[0];

        const svg = d3.select("#boundaryMap");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // northeast philadelphia zipcodes
        const northeast_zipcodes = new Set(["19111","19114","19115","19116","19120","19124","19149","19152","19154"]);
        
        const projection = d3.geoAlbers()
            .center([-75.1652, 39.9526])  // Philadelphia, PA coordinates
            .rotate([0, 0])
            .parallels([39.9, 40.0])      // standard parallels for Pennsylvania
            .scale(70000)                 // scale
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        // zip code areas
        svg.append("g")
        .selectAll("path")
        .data(zipcodes_poly.features)
        .join("path")
        .attr("d", path)
        .attr("fill", feature => {
            const zipCode = feature.properties.CODE;
            return northeast_zipcodes.has(zipCode) ? "steelblue" : "#f0f0f0";
        })
        .attr("stroke", "#333")
        .attr("stroke-width", 0.7)
        .attr("stroke-opacity", 0.8)
        .style("cursor", feature => { // pointer for northeast area
            return northeast_zipcodes.has(feature.properties.CODE) ? "pointer" : "default";
        })
        .on("mouseover", function(event, feature) { // highlight northeast area
            if (northeast_zipcodes.has(feature.properties.CODE)) {
                d3.select(this).attr("fill", "orange");
            }
        })
        .on("mouseout", function(event, feature) { // mouse out highlight northeast area
            if (northeast_zipcodes.has(feature.properties.CODE)) {
                d3.select(this).attr("fill", "steelblue");
            }
        });

    }).catch((error) => {
        console.error("Error loading data:", error);
    });
})();