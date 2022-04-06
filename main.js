/**
 * Main function which loads the map data from the geojson file and covid data from the csv file.
 * Map is drawn with the data loaded from the csv file, color of each country is determined by population density.
 */
/* local and global vairable declarations*/

//geojson and data file loading.
let fertilityfile = d3.csv("Fertility.csv");
let mortalityfile = d3.csv("Mortality.csv");
let populationfile = d3.csv("Estimates.csv");
let fertilityData, mortalityData, populationData;

// Load external data and boot
Promise.all([fertilityfile, mortalityfile, populationfile]).then(function (
  data
) {
  //Data is grouped on iso code.
  fertilityData = d3.group(data[0], (d) => {
    return d.ccode;
  });

  //Data is grouped on iso code.
  mortalityData = d3.group(data[1], (d) => {
    return d.ccode;
  });

  //Data is grouped on iso code.
  populationData = d3.group(data[2], (d) => {
    return d.ccode;
  });

  drawSunBurst();
  drawLineOne(populationData.get("900"), fertilityData.get("900"));
  drawLineTwo(populationData.get("900"), mortalityData.get("900"));
  drawLineThree(fertilityData.get("900"), mortalityData.get("900"));
});

function drawLines(ccode) {
  drawLineOne(populationData.get(ccode), fertilityData.get(ccode));
  drawLineTwo(populationData.get(ccode), mortalityData.get(ccode));
  drawLineThree(fertilityData.get(ccode), mortalityData.get(ccode));
}
