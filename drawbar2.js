/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function drawBarTwo(data) {
  //
  const bardata = filterData(data, 2100, 12);

  var svg = d3.select("body").select("#chart3"),
    u,
    uu;
  const xSize = +svg.attr("width");
  const ySize = +svg.attr("height");
  const margin = 65;
  const xMax = xSize - margin;
  const yMax = ySize - margin * 2;

  // Get the 'limits' of the data - the full extent (mins and max)
  // so the plotted data fits perfectly
  var xExtent = d3.extent(bardata, (d) => {
    return Number(d.count);
  });

  svg
    .append("text")
    .attr("x", 70)
    .attr("y", 20)
    .attr("stroke-width", "0.5px")
    .attr("font-size", "14px")
    .text("World Population between 2020 & 2100");

  // X Axis
  var x = d3.scaleLinear().domain([xExtent[0], xExtent[1]]).range([0, xMax]);
  var color = d3.scaleOrdinal().domain(bardata).range(d3.schemeSet3);

  // bottom
  let svgL = svg
    .append("g")
    .attr("transform", "translate(10," + margin + ")")
    .attr("width", xMax)
    .attr("height", yMax);

  //xAxis
  var xAxis = svgL
    .append("g")
    .attr("class", "myATaxis")
    .attr("transform", "translate(0,0)")
    .attr("width", xMax)
    .call(d3.axisTop(x).ticks(6))
    .attr("color", "green"); // make bottom axis green

  function update(idata) {
    //
    console.log(idata);
    //
    xExtent = d3.extent(idata, (d) => {
      return Number(d.count);
    });
    x = d3.scaleLinear().domain([xExtent[0], xExtent[1]]).range([0, xMax]);
    svgL
      .select(".myATaxis")
      .attr("transform", "translate(0,0)")
      .call(d3.axisTop(x).ticks(6));

    //svgL.selectAll("*").remove();
    svgL.append("g");

    u = svgL.selectAll("rect").data(
      idata.filter(function (d) {
        return Number(d.rank) < 12;
      })
    );
    uu = u
      .enter()
      .append("g")
      .attr("transform", function (d, i) {
        var y = i * 20 + 5;
        return "translate(0," + y + ")";
      });

    uu.append("rect")
      .merge(u)
      .transition()
      .duration(1000)
      .attr("fill", function (d) {
        return color(d.name);
      })
      .attr("width", function (d) {
        return x(d.count);
      })
      .attr("height", 15);

    uu.append("text")
      .transition()
      .duration(1000)
      .attr("x", function (d) {
        //      return x(d.count);
        return 5;
      })
      .attr("y", 10)
      .attr("dy", ".20em")
      .attr("font-size", "12px")
      .text(function (d) {
        return d.name;
      });

    u.exit().transition().duration(200).style("opacity", 0).remove();
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
  let j;
  for (j = 2020; j <= 2100; j++) {
    update(filterData(data, j, 12));
  }
}
