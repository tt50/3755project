(function() {
    // read in zip code geojson file for boundary map
    Promise.all([
        d3.json("./Zipcodes_Poly.geojson"),
        d3.json("./numberOfVehiclesHousehold_ZipCode.json"),
        d3.json("./meansOfTransportation_ZipCode.json")
    ]).then((data) => {
        const zipcodes_poly = data[0];
        const number_of_vehicles = data[1];
        const means_of_transportation = data[2];

        // search by zipcode, for number of vehicles
        const vehicleLookup = {};
        number_of_vehicles.number_of_vehicles_per_household.forEach(item => {
            vehicleLookup[item.zipcode] = {
                without_a_vehicle: item.without_a_vehicle,
                one_or_more_vehicles: item.one_or_more_vehicles
            };
        });

        // means of transportation
        const means_of_transportationLookup = {};
        means_of_transportation.means_of_transportation.forEach(item => {
            means_of_transportationLookup[item.zipcode] = {
                "Car, truck, or van": item["Car, truck, or van"],
                "Public transporation": item["Public transporation"],
                "Taxicab": item["Taxicab"],
                "Motorcycle": item["Motorcycle"],
                "Bicycle, Walked, or Other Means": item["Bicycle, Walked, or Other Means"],
                "Worked at Home": item["Worked at Home"]
            };
        });

        const svg = d3.select("#boundaryMap");
        const width = +svg.attr("width");
        const height = +svg.attr("height");

        // northeast philadelphia zipcodes
        const northeast_zipcodes = new Set(["19111","19114","19115","19116","19120","19124","19149","19152","19154"]);
        
        const projection = d3.geoAlbers()
            .center([-75.1652, 39.9526])  // Philadelphia, PA coordinates
            .rotate([0, 0])
            .parallels([39.9, 40.0])      // standard parallels for Pennsylvania
            .scale(100000)                 // scale
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
        .style("cursor", feature => {
            return northeast_zipcodes.has(feature.properties.CODE) ? "pointer" : "default";
        })
        .on("mouseover", function(event, feature) {
            const zipCode = feature.properties.CODE;
            const vehicleData = vehicleLookup[zipCode];
            const meansOfTransportationData = means_of_transportationLookup[zipCode];

            if (northeast_zipcodes.has(zipCode)) {
                d3.select(this).attr("fill", "orange");
            }

            if (vehicleData) {
                d3.select("#tooltip")
                    .style("display", "block")
                    .html(`
                        <h3>Zipcode: ${zipCode}</h3>
                        <div style="padding: 10px"></div>
                        <div><strong>Vehicle Ownership</strong></div>
                        <div>0 Vehicles: ${vehicleData.without_a_vehicle}%</div>
                        <div>1 or more Vehicles: ${vehicleData.one_or_more_vehicles}%</div>
                        <div style="padding: 10px"></div>
                        <div><strong>Means Of Transportation</strong></div>
                        <div>Car, truck, or van: ${meansOfTransportationData["Car, truck, or van"]}%</div>
                        <div>Public transporation: ${meansOfTransportationData["Public transporation"]}%</div>
                        <div>Taxicab: ${meansOfTransportationData["Taxicab"]}%</div>
                        <div>Motorcycle: ${meansOfTransportationData["Motorcycle"]}%</div>
                        <div>Bicycle, Walked, or Other Means: ${meansOfTransportationData["Bicycle, Walked, or Other Means"]}%</div>
                        <div>Worked at Home: ${meansOfTransportationData["Worked at Home"]}%</div>
                    `)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            }
        })
        .on("mouseout", function(event, feature) {
            const zipCode = feature.properties.CODE;
            if (northeast_zipcodes.has(zipCode)) {
                d3.select(this).attr("fill", "steelblue");
            }
            d3.select("#tooltip").style("display", "none");
        })
        .on("mousemove", function(event) {
            d3.select("#tooltip")
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 10) + "px");
        });

    }).catch((error) => {
        console.error("Error loading data:", error);
    });
})();