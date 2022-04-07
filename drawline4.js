/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function drawLineFour(data1, data2) {
  let localpastdata = [],
    localfuturedata = [],
    filtereddata = [];

  data1.forEach(function (d) {
    processData(d, localpastdata, 1950, 2020);
  });

  data2.forEach(function (d) {
    processData(d, localfuturedata, 2020, 2100);
  });

  // console.log(filterData(localpastdata, 1970, 12));

  drawBarOne(filterData(localpastdata, 2020, 12));
  /*
let j=0;
for (j=1950; j<2020; j++){
  drawBarOne(filterData(localpastdata, j, 12));
}
*/

  function processData(dataIn, dataOut, minYear, maxYear) {
    for (let i = minYear; i <= maxYear; i++) {
      dataOut.push({
        name: dataIn["Region"],
        ccode: dataIn["ccode"],
        pcode: dataIn["pcode"],
        type: dataIn["Type"],
        year: i,
        count: Number(dataIn[i]),
      });
    }
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
}
