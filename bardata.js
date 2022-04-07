/**
 * bardata function which receives the data from main function. From main function past population and projected population details are passed on as arguments. The data is reformatted
 *  to use in the bar chart drawing.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function bardata(data1, data2) {
  let localpastdata = [], // local variable to store the reformatted past population data.
    localfuturedata = []; // local variable to store the reformatted projecrted population data.

  // past population data is formatted based on the data available between years 1950 and 2020.
  // Function processData is called with past population data and the upper and lower limit of years.
  data1.forEach(function (d) {
    processData(d, localpastdata, 1950, 2020);
  });

  // projected population data is formatted based on the data available between years 2020 and 2100.
  // Function processData is called with projected population data and the upper and lower limit of years.
  data2.forEach(function (d) {
    processData(d, localfuturedata, 2020, 2100);
  });

  // drawBarOne function is called to draw the bar chart with localpastdata as argument.
  drawBarOne(localpastdata);
  // drawBarTwo function is called to draw the bar chart with localfuturedata as argument.
  drawBarTwo(localfuturedata);

  // function processData reformats the data to use in bar chart creation.
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
