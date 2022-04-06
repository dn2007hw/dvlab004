function drawSunBurst() {
  //CSV file path is referenced to a local variable to be used later in the code.
  let csv = "WORLD.csv";
  d3.csv(csv, function (data) {
    return data;
  }).then(function (data) {
    var nodeById = {};
    var pparent = {};

    // Index the nodes by id, in case they come out of order.
    data.forEach(function (d) {
      nodeById[d.ccode] = d;
    });

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

    data = pparent[1828];
    // JSON data
    var nodeData = pparent[1828];

    // Variables

    var color = d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, data.children.length + 1)
    );

    const svg = d3.select("body").select("#sunburst");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    var radius = Math.min(width, height) / 2;
    var format = d3.format(",d");

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

    //  console.log(arc);

    // Put it all together
    const path = g
      .append("g")
      .selectAll("path")
      // .data(root.descendants())
      //    .data(root.descendants().slice(0))
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

    path
      .filter((d) => d)
      .style("cursor", "pointer")
      //  .on("mouseover", onmouseOver)
      .on("click", clicked);

    path.append("title").text(
      (d) =>
        `${d
          .ancestors()
          .map((d) => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

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

    svg
      .append("text")
      .attr("x", 25)
      .attr("y", 25)
      .attr("font-size", "20px")
      .text("WORLD POPULATION PROJECTION 2020 - 2100");

    svg
      .append("text")
      .attr("x", 600)
      .attr("y", 400)
      .attr("font-size", "10px")
      .text("WORLD POPULATION");

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
    }

    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }

    function clicked(event, p) {
      drawLines(p.data.ccode);
    }

    function onmouseOver(event, p) {
      //    console.log(p.data.name);
    }
  });
}
