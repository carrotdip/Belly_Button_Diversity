function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      var PANEL = d3.select("#sample-metadata");
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    
  // Deliverable 1 - Bar Graph

    // 3. Create a variable that holds the samples array. 
    var sample_values = data.samples;
    console.log(sample_values);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var targetArray = sample_values.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    console.log(metadata);
    var targetMeta = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(targetMeta);

    //  5. Create a variable that holds the first sample in the array.
    var targetSample = targetArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var targetIds = targetSample.otu_ids;
    var targetLabels = targetSample.otu_labels;
    var targetValues  = targetSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var targetWfreq = parseFloat(targetMeta.wfreq);
    console.log(typeof targetWfreq);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = targetIds.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    console.log(yticks);
  
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: targetValues.slice(0,10).reverse(),
      y: yticks,
      text : targetLabels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacterial Cultures Found",
      margin: { t: 50, l: 150 }
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

  // Deliverable 2 - Bubble Chart

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: targetIds,
      y: targetValues,
      text: targetLabels,
      type: 'bubble', //or 'scatter'
      mode: 'markers',
      marker: {
        size: targetValues,
        sizeref: 0.1,
        sizemode: 'area',
        color: targetIds,
        colorscale: 'Bluered',
        opacity: 0.5
      }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1200,
      hovermode: "closest"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleData,bubbleLayout);

  // Deliverable 3 - Gauge Chart

    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
     value: targetWfreq,
     type: 'indicator',
     mode: 'gauge+number',
     title: {text:"<b>Bellybutton Washing Frequency</b><br>Scrubs per Week"},
     gauge: {
       axis: { range: [null, 10]},
       bar: {color: 'black'},
       bordercolor: "black",
       steps: [
         {range: [0,2], color: 'crimson'},
         {range: [2,4], color: 'lightcoral'},
         {range: [4,6], color: 'mediumorchid'},
         {range: [6,8], color: 'mediumslateblue'},
         {range: [8,10], color: 'royalblue'}
       ]
     }
  }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500,
      height: 400
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge',gaugeData,gaugeLayout);

  })}