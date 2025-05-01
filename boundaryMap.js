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

        const projection = d3.geoAlbers()
            .center([-75.1652, 39.9526])  // Philadelphia, PA coordinates
            .rotate([0, 0])
            .parallels([39.9, 40.0])      // standard parallels for Pennsylvania
            .scale(70000)                 // scale
            .translate([width / 2, height / 2]);

        const path = d3.geoPath().projection(projection);

        svg.append("g")
            .selectAll("path")
            .data(zipcodes_poly.features)
            .join("path")
            .attr("d", path)
            .attr("fill", '#ccc')  
            .attr("stroke", "black")
            .attr("stroke-width", "1px");

    }).catch((error) => {
        console.error("Error loading data:", error);
    });

})();