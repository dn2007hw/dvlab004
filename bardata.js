/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function bardata(data1, data2) {
  let localpastdata = [],
    localfuturedata = [],
    filtereddata = [];

  data1.forEach(function (d) {
    processData(d, localpastdata, 1950, 2020);
  });

  data2.forEach(function (d) {
    processData(d, localfuturedata, 2020, 2100);
  });

  drawBarOne(localpastdata);
  drawBarTwo(localfuturedata);

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
}
