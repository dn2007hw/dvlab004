/**
 * drawSunBurst function - Invoked from main function, draws sunburst based on the region details from the WORLD csv file.
 *  * @param - none
 *  * @return {void} Nothing
 */
function drawSunBurst() {
  //CSV file path is referenced to a local variable to be used later in the code.
  let csv = "WORLD.csv";

  //CSV file is accessed and the data is referenced in the code.
  d3.csv(csv, function (data) {
    return data;
  }).then(function (data) {
    var nodeById = {}; //local variable to store the intermediate data during formatting.
    var pparent = {}; //local variable to store the intermediate data during formatting.

    // Index the nodes by id, in case they come out of order. The county code in the CSV file available in column ccode is used to index the data.
    data.forEach(function (d) {
      nodeById[d.ccode] = d;
    });

    // parent code in the csv file used as a partent identifier for each country and region in the file and based on that json file is build.
    data.forEach(function (d) {
      if ("pcode" in d) {
        var parent1 = nodeById[d.pcode];
        if (parent1 !== undefined) {
          if (parent1.children) parent1.children.push(d);
          else parent1.children = [d];
        }
      }
      pparent[d.pcode] = parent1;
    });

    //Index 1828 is the root of the hierachy in the data file, which is used to build the json data hierarchy.
    data = pparent[1828];

    // JSON data prepated is stored in a local variable to use further in the code.
    var nodeData = pparent[1828];

    // Local variable to retrieve the color from scale.
    var color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );

    //local svg elelment to refer the svg element already created in html.
    const svg = d3.select("body").select("#sunburst");
    const width = +svg.attr("width"); // width of the svg element is retrieved from html
    const height = +svg.attr("height"); // height of the svg element is retrieved from html
    var radius = Math.min(width, height) / 2; //radius is computed based on the width and height
    var format = d3.format(",d"); //format is defined to display the hierarchy along the pointer

    // Create primary <g> element
    var g = svg
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Data strucure
    var partition = d3.partition().size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(nodeData).sum(function (d) {
      return d.size;
    });

    // Size arcs
    partition(root);

    //define arcs
    var arc = d3
      .arc()
      .startAngle(function (d) {
        return d.x0;
      })
      .endAngle(function (d) {
        return d.x1;
      })
      .innerRadius(function (d) {
        return d.y0;
      })
      .outerRadius(function (d) {
        return d.y1;
      });

    // Put it all together
    const path = g
      .append("g")
      .selectAll("path")
      .data(root)
      .enter()
      .append("path")
      .attr("display", function (d) {
        return d.depth ? null : "none";
      })
      .attr("d", arc)
      .attr("class", "sburst")
      .style("fill", function (d) {
        return color((d.children ? d : d.parent).data.name);
      })
      .style("cursor", "pointer")
      .on("mouseenter", onmouseOver)
      .on("click", clicked);

    // title is added to the pointer when the mouse is hovered over the svg, the title with hierarchy is displayed
    path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

    // the region name is displayed over the individual drawn area
    const label = g
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .style("user-select", "none")
      .selectAll("text")
      .data(root.descendants().slice(1))
      .join("text")
      .attr("class", "stext")
      .attr("dy", "0.35em")
      .attr("fill-opacity", (d) => labelVisible(d))
      .attr("transform", (d) => labelTransform(d))
      .text((d) => d.data.name);

    // visualization header is printed on the top of the screen
    svg
      .append("text")
      .attr("x", 25)
      .attr("y", 25)
      .attr("font-size", "24px")
      .text("WORLD POPULATION PROJECTION 2020 - 2100");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextL1")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("font-size", "15px")
      .style("text-anchor", "middle")
      .text("WORLD");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextL2")
      .attr("x", width / 2)
      .attr("y", height / 2 + 15)
      .attr("font-size", "12px")
      .style("text-anchor", "middle")
      .text("");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextL3")
      .attr("x", 50)
      .attr("y", 120)
      .attr("font-size", "22px")
      .text("WORLD");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP11")
      .attr("x", 50)
      .attr("y", 150)
      .attr("font-size", "20px")
      .text("2020 Data");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP12")
      .attr("x", 50)
      .attr("y", 170)
      .attr("font-size", "16px")
      .text("Medium Variant: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP13")
      .attr("x", 50)
      .attr("y", 190)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("High Variant: ");

    svg
      .append("text")
      .attr("id", "mtextP14")
      .attr("x", 50)
      .attr("y", 210)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Low Variant: ");

    svg
      .append("text")
      .attr("id", "mtextP15")
      .attr("x", 50)
      .attr("y", 230)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Constant Fertility: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP16")
      .attr("x", 50)
      .attr("y", 250)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Constant Mortality: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP21")
      .attr("x", 50)
      .attr("y", 300)
      .attr("font-size", "20px")
      .text("2100 Projection");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP22")
      .attr("x", 50)
      .attr("y", 320)
      .attr("font-size", "16px")
      .text("Medium Variant: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP23")
      .attr("x", 50)
      .attr("y", 340)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("High Variant: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP24")
      .attr("x", 50)
      .attr("y", 360)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Low Variant: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP25")
      .attr("x", 50)
      .attr("y", 380)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Constant Fertility: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP26")
      .attr("x", 50)
      .attr("y", 400)
      .attr("font-size", "16px")
      .style("text-anchor", "Left")
      .text("Constant Mortality: ");

    // Information display
    svg
      .append("text")
      .attr("id", "mtextP27")
      .attr("x", 50)
      .attr("y", 420)
      .attr("font-size", "10px")
      .style("text-anchor", "Left")
      .text("* all data in multiples of thousand.");

    //function is determine the label visibility
    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    //function is determine the label transformation for the display
    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    //mouse click event over the sunburst
    function clicked(event, p) {
      drawLines(p.data.ccode);
    }

    // display of information on the screen while mouse hovering over the sunburst
    function onmouseOver(event, p) {
      svg.select("#mtextL1").text(p.data.name);
      svg.select("#mtextL3").text(p.data.name);
      svg.select("#mtextL2").text("Current Population:" + p.data.population);
      svg.select("#mtextP12").text("Medium Variant: " + p.data.medium2020);
      svg.select("#mtextP13").text("High Variant: " + p.data.high2020);
      svg.select("#mtextP14").text("Low Variant: " + p.data.low2020);
      svg.select("#mtextP15").text("Constant Fertility: " + p.data.fert2020);
      svg.select("#mtextP16").text("Constant Mortality: " + p.data.mort2020);
      svg.select("#mtextP22").text("Medium Variant: " + p.data.medium2100);
      svg.select("#mtextP23").text("High Variant: " + p.data.high2100);
      svg.select("#mtextP24").text("Low Variant: " + p.data.low2100);
      svg.select("#mtextP25").text("Constant Fertility: " + p.data.fert2100);
      svg.select("#mtextP26").text("Constant Mortality: " + p.data.mort2100);
    }
  });
}
