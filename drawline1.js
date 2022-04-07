/**
 * drawLineOne function which receives the data from main function and draws comparison line chart with projected population, fertility and mortality data.
 *  * @param - dataOne carries the population data, dataTwo carries the fertilify data and dataThree carries the mortality data.
 *  * @return {void} Nothing
 */
function drawLineOne(dataOne, dataTwo, dataThree) {
  let tempdataOne = processData(dataOne[0]); //local variable to store the projected population data after reformatting thru function processData.
  let tempdataTwo = processData(dataTwo[0]); //local variable to store the projected fertility data after reformatting thru function processData.
  let tempdataThree = processData(dataThree[0]); //local variable to store the projected mortality data after reformatting thru function processData.

  let idleTimeout; // local vairable to store the idleTimeout used in brushing
  const svgL = d3.select("body").select("#chart1"); //local svg variable to refer the SVG defined in HTML.
  const xSize = +svgL.attr("width"); //local variable to retrieve the width of SVG fro HTML.
  const ySize = +svgL.attr("height"); //local variable to retrieve the height of SVG fro HTML.
  const margin = 65; // local variable to store the margin of the SVG.
  const xMax = xSize - margin; // local vairiable to store the maximum of x axis to be used with in the SVG.
  const yMax = ySize - margin * 2; // local vairiable to store the maximum of x axis to be used with in the SVG.

  // Get the 'limits' of the data - the full extent (mins and max)
  // so the plotted data fits perfectly
  //xExtent determines the range of years for the X axis.
  const xExtent = d3.extent(tempdataOne, (d) => {
    return Number(d.year);
  });

  //yExtent determines the range of values for the Y axis.
  const y1Extent = d3.extent(tempdataOne, (d) => {
    return Number(d.count);
  });
  const y2Extent = d3.extent(tempdataTwo, (d) => {
    return Number(d.count);
  });
  const y3Extent = d3.extent(tempdataThree, (d) => {
    return Number(d.count);
  });

  const yExtent = [];
  yExtent[0] = d3.min([y1Extent[0], y2Extent[0], y3Extent[0]]);
  yExtent[1] = d3.max([y1Extent[1], y2Extent[1], y3Extent[1]]);

  // X scale is defined for the value to be plotted along X Axis
  const x = d3.scaleLinear().domain([xExtent[0], xExtent[1]]).range([0, xMax]);

  svgL.selectAll("*").remove();
  // bottom
  let svgLine = svgL
    .append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")");

  const xAxis = svgLine
    .append("g")
    .attr("transform", "translate(0," + yMax + ")")
    .call(d3.axisBottom(x).ticks(6))
    .attr("color", "green"); // make bottom axis green

  // Y Axis
  const y = d3.scaleLinear().domain([yExtent[0], yExtent[1]]).range([yMax, 0]);

  // left y axis
  const yAxis = svgLine.append("g").call(d3.axisLeft(y).ticks(8));

  // Add a clipPath: everything out of this area won't be drawn.
  svgL
    .append("defs")
    .append("svgL:clipPath")
    .attr("id", "clip")
    .append("svgL:rect")
    .attr("width", xMax)
    .attr("height", yMax)
    .attr("x", 0)
    .attr("y", 0);

  let brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, 0],
      [xMax, yMax],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", onBrushed); // Each time the brush selection changes, trigger the 'updateChart' function

  //let svgPL = svgLine.append("g");
  let svgPL = svgLine.append("g").attr("clip-path", "url(#clip)");

  svgPL
    .append("g")
    .attr("transform", "translate(0,0)")
    .attr("width", xMax)
    .attr("height", yMax)
    .attr("class", "brush")
    .call(brush);

  // Add the line 1
  svgPL
    .append("path")
    .datum(tempdataOne)
    .attr("id", "chart1line1")
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1)
    .style("opacity", 0.3)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );

  // Add the line 2
  svgPL
    .append("path")
    .datum(tempdataTwo)
    .attr("id", "chart1line2")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1)
    .style("opacity", 0.3)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );

  // Add the line 3
  svgPL
    .append("path")
    .datum(tempdataThree)
    .attr("id", "chart1line3")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1)
    .style("opacity", 0.3)
    .attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );

  svgL
    .append("text")
    .attr("x", 70)
    .attr("y", 20)
    .attr("stroke-width", "0.5px")
    .attr("font-size", "14px")
    .text("Comparison chart - Population vs Fertility vs Mortality");

  svgL
    .append("text")
    .attr("x", 70)
    .attr("y", 35)
    .attr("stroke-width", "0.5px")
    .attr("font-size", "12px")
    .text(tempdataOne[0].name);

  svgL
    .append("text")
    .attr("x", 60)
    .attr("y", 50)
    .attr("stroke", "green")
    .attr("stroke-width", "0.4px")
    .attr("font-size", "10px")
    .text("---Population");

  svgL
    .append("text")
    .attr("x", 160)
    .attr("y", 50)
    .attr("stroke", "blue")
    .attr("stroke-width", "0.4px")
    .attr("font-size", "10px")
    .text("---Fertility");

  svgL
    .append("text")
    .attr("x", 260)
    .attr("y", 50)
    .attr("stroke", "red")
    .attr("stroke-width", "0.4px")
    .attr("font-size", "10px")
    .text("---Mortality");

  function idled() {
    idleTimeout = null;
  }

  function onBrushed(event) {
    const extent = event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      {
        x.domain([xExtent[0], xExtent[1]]);
      }
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      svgLine.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(500).call(d3.axisBottom(x).ticks(5));

    // redraw line1
    svgPL.select("#chart1line1").attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );

    // redraw line2
    svgPL.select("#chart1line2").attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );

    // redraw line3
    svgPL.select("#chart1line3").attr(
      "d",
      d3
        .line()
        .x(function (d) {
          return x(Number(d.year));
        })
        .y(function (d) {
          return y(Number(d.count));
        })
    );
  }
  //function processData is called upon using population / fertility / mortality data as argument. The data is reformatted and retured as an array of objects.
  function processData(data) {
    let localdata = [];
    for (let i = 2020; i <= 2100; i++) {
      localdata.push({
        name: data["Region"],
        ccode: data["ccode"],
        pcode: data["pcode"],
        type: data["Type"],
        year: i,
        count: Number(data[i]),
      });
    }
    return localdata;
  }
}
