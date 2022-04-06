/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function drawLineThree(dataOne, dataTwo) {
  let tempdataOne = processData(dataOne[0]);
  let tempdataTwo = processData(dataTwo[0]);

  const svgL = d3.select("body").select("#chart3");
  const xSize = +svgL.attr("width");
  const ySize = +svgL.attr("height");
  const margin = 65;
  const xMax = xSize - margin;
  const yMax = ySize - margin * 2;

  // Get the 'limits' of the data - the full extent (mins and max)
  // so the plotted data fits perfectly
  const xExtent = d3.extent(tempdataOne, (d) => {
    return Number(d.year);
  });

  const y1Extent = d3.extent(tempdataOne, (d) => {
    return Number(d.count);
  });
  const y2Extent = d3.extent(tempdataTwo, (d) => {
    return Number(d.count);
  });

  const yExtent = [];
  yExtent[0] = d3.min([y1Extent[0], y2Extent[0]]);
  yExtent[1] = d3.max([y1Extent[1], y2Extent[1]]);

  // X Axis
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

  let svgPL = svgLine.append("g");

  // Add the line
  svgPL
    .append("path")
    .datum(tempdataOne)
    .attr("id", "chart3line1")
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

  // Add the line
  svgPL
    .append("path")
    .datum(tempdataTwo)
    .attr("id", "chart3line1")
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

  svgL
    .append("text")
    .attr("x", 70)
    .attr("y", 20)
    .attr("stroke-width", "0.5px")
    .attr("font-size", "14px")
    .text(tempdataOne[0].name + " - Fertility vs Mortality");

  svgL
    .append("text")
    .attr("x", 60)
    .attr("y", 35)
    .attr("stroke", "green")
    .attr("stroke-width", "0.4px")
    .attr("font-size", "10px")
    .text("---Fertility");

  svgL
    .append("text")
    .attr("x", 60)
    .attr("y", 50)
    .attr("stroke", "blue")
    .attr("stroke-width", "0.4px")
    .attr("font-size", "10px")
    .text("---Mortality");
}

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
