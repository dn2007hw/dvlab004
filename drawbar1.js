/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function drawBarOne(data) {
  const bardata = filterData(data, 2020, 12);

  const svgL = d3.select("body").select("#chart2");
  const xSize = +svgL.attr("width");
  const ySize = +svgL.attr("height");
  const margin = 65;
  const xMax = xSize - margin;
  const yMax = ySize - margin * 2;

  // Get the 'limits' of the data - the full extent (mins and max)
  // so the plotted data fits perfectly
  const xExtent = d3.extent(bardata, (d) => {
    return Number(d.count);
  });

  // X Axis
  const x = d3.scaleLinear().domain([xExtent[0], xExtent[1]]).range([0, xMax]);
  const color = d3.scaleOrdinal().domain(bardata).range(d3.schemeSet3);

  // bottom
  let svgLine = svgL
    .append("g")
    .attr("transform", "translate(10," + margin + ")")
    .attr("width", xMax)
    .attr("height", yMax);

  svgL
    .append("text")
    .attr("x", 70)
    .attr("y", 20)
    .attr("stroke-width", "0.5px")
    .attr("font-size", "14px")
    .text("World Population between 1950 & 2020");

  function update(data) {
    //xAxis
    const xAxis = svgLine
      .append("g")
      .attr("transform", "translate(0,0)")
      .attr("width", xMax)
      .call(d3.axisTop(x).ticks(6))
      .attr("color", "green"); // make bottom axis green

    //svgL.selectAll("*").remove();
    let svgPL = svgLine.append("g");

    let u = svgPL.selectAll("rect").data(
      data.filter(function (d) {
        return Number(d.rank) < 12;
      })
    );
    let uu = u
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        var y = i * 20 + 5;
        return "translate(0," + y + ")";
      });

    uu.append("rect")
      .merge(u)
      .transition()
      .duration(3000)
      .attr("fill", function (d) {
        return color(d.name);
      })
      .attr("width", function (d) {
        return x(d.count);
      })
      .attr("height", 15);

    uu.append("text")
      .transition()
      .duration(3000)
      .attr("x", function (d) {
        return 5;
      })
      .attr("y", 10)
      .attr("dy", ".20em")
      .attr("font-size", "12px")
      .text(function (d) {
        return d.name;
      });

    u.exit().transition().duration(2000).style("opacity", 0).remove();
  }

  function filterData(data, year, n) {
    let localfiltereddata = data.filter(function (d) {
      return Number(d.year) == year && d.type == "Country/Area";
    });
    localfiltereddata.sort((a, b) => d3.descending(a.count, b.count));
    for (let i = 0; i < localfiltereddata.length; i++)
      localfiltereddata[i].rank = Math.min(n, i);
    return localfiltereddata;
  }

  update(bardata);
  /*
  for (let j = 1950; j < 2020; j++) {
  update(filterData(data, j, 12));
  }
  */
}
