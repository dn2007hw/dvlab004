/**
 * Main function which loads the map data from the geojson file and covid data from the csv file.
 * Map is drawn with the data loaded from the csv file, color of each country is determined by population density.
 */
//CSV file path is referenced to a local variable to be used later in the code.
let fertilityfile = d3.csv("Fertility.csv"); // fertility based data csv file referrence
let mortalityfile = d3.csv("Mortality.csv"); // mortality based data csv file referrence
let populationfile = d3.csv("Population.csv"); // past population data csv file referrence
let estimationfile = d3.csv("Estimates.csv"); // projected population data csv file referrence

let fertilityData, // local variable to store the fertility data
  mortalityData, // local variable to store the mortality data
  populationData, // local variable to store the past population data
  estimationData; // local variable to store the projection population data

// Load external data
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

  drawSunBurst(); // function invoved to draw the sunburst

  //line chart drawing function is called with projected population, fertility and mortality data as arguments.
  drawLineOne(
    estimationData.get("900"),
    fertilityData.get("900"),
    mortalityData.get("900")
  );
  // bardata function is called to sanitize and format the past population and projected populatoin data
  bardata(data[2], data[3]);
});

//function invoked from sunburst to display the clicked region info
function drawLines(ccode) {
  drawLineOne(
    estimationData.get(ccode),
    fertilityData.get(ccode),
    mortalityData.get(ccode)
  );
}
