/**
 * drawLineTwo function which receives the data from main function and draws bar chart on the vaccination details.
 *  * @param - data of a country for which the bar chart needs to be drawn.
 *  * @return {void} Nothing
 */
function drawLineFour(data1, data2) {
  let localdata = [];
  for (x in data1) {
    processData(data1[x]);
  }
  console.log(localdata);

  function processData(data) {
    for (let i = 1950; i <= 2020; i++) {
      localdata.push({
        name: data["Region"],
        ccode: data["ccode"],
        pcode: data["pcode"],
        type: data["Type"],
        year: i,
        count: Number(data[i]),
      });
    }

    let localdata1 = [];
    localdata.forEach(function (d) {
      localdata1[d.year] = d;
    });
    return localdata1;
  }
}
