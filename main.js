/**
 * Main function which loads the map data from the geojson file and covid data from the csv file.
 * Map is drawn with the data loaded from the csv file, color of each country is determined by population density.
 */
/* local and global vairable declarations*/

//geojson and data file loading.
let fertilityfile = d3.csv("Fertility.csv");
let mortalityfile = d3.csv("Mortality.csv");
let populationfile = d3.csv("Population.csv");
let estimationfile = d3.csv("Estimates.csv");

let fertilityData, mortalityData, populationData, estimationData;

// Load external data and boot
Promise.all([
  fertilityfile,
  mortalityfile,
  populationfile,
  estimationfile,
]).then(function (data) {
  //Data is grouped on country code.
  fertilityData = d3.group(data[0], (d) => {
    return d.ccode;
  });

  //Data is grouped on country code.
  mortalityData = d3.group(data[1], (d) => {
    return d.ccode;
  });

  //Data is grouped on country code.
  populationData = d3.group(data[2], (d) => {
    return d.ccode;
  });

  //Data is grouped on country code.
  estimationData = d3.group(data[3], (d) => {
    return d.ccode;
  });

  drawSunBurst();
  drawLineOne(
    estimationData.get("900"),
    fertilityData.get("900"),
    mortalityData.get("900")
  );
  bardata(data[2], data[3]);
});

function drawLines(ccode) {
  drawLineOne(
    estimationData.get(ccode),
    fertilityData.get(ccode),
    mortalityData.get(ccode)
  );
}
