//===========================
// D3 Animated Scatter Plot
//===========================

//===========================
// 1) Pre-Data Setup
//===========================

// Get the width of the containing box
var width = parseInt(d3.select("#scatter").style("width"));

// Designate the height of the graph
var height = width - width / 3.9;

// Margin spacing for graph
var margin = 20;

// Space for placing words
var labelArea = 110;

// Padding for the text at the bottom and left axes
var tPadBot = 40;
var tPadLeft = 40;

// Create the canvas for the graph
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", "chart");

// Set the radius for each dot that will appear in the graph
var circRadius;
function crGet() {
  if (width <= 530) {
    circRadius = 5;
  }
  else {
    circRadius = 10;
  }
}
crGet();

//===========================
// Labels for the axes
//===========================

//===========================
// A) Bottom axis
//===========================

// Create a group element to nest bottom axes labels
svg.append("g").attr("class", "xText");

// xText to select the group
var xText = d3.select(".xText");

// Transform and translate to place it at the bottom of the chart
function xTextRefresh() {
  xText.attr(
    "transform",
    "translate(" +
      ((width - labelArea) / 2 + labelArea) +
      ", " +
      (height - margin - tPadBot) +
      ")"
  );
}
xTextRefresh();

// Use xText to append three text SVG files, with y coordinates specified to space out the values

// 1. Poverty
xText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");

// 2. Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");

// 3. Income
xText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

//===========================
// B) Left axis
//===========================

// Assign variables to make transform attributes more readable
var leftTextX = margin + tPadLeft;
var leftTextY = (height + labelArea) / 2 - labelArea;

// Add a second label group for the axis left of the chart
svg.append("g").attr("class", "yText");

// yText to select the group
var yText = d3.select(".yText");

// Transform and translate
function yTextRefresh() {
  yText.attr(
    "transform",
    "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
  );
}
yTextRefresh();

//===========================
// Append the text
//===========================

// 1. Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// 2. Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// 3. Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

//===========================
// 2) Import data.csv file
//===========================

// Import csv data with d3's .csv import method
d3.csv("assets/data/data.csv").then(function(data) {

// Visualize the data
  visualize(data);
});

//===========================
// 3) Create the visualization function
//===========================

// This function handles the visual manipulation of all elements dependent on the data
function visualize(theData) {

  // curX and curY will determine what data gets represented in each axis
  var curX = "poverty";
  var curY = "obesity";

  // Save empty variables for the min and max values of x and y
  var xMin;
  var xMax;
  var yMin;
  var yMax;

  // Function to set up tooltip rules
  var toolTip = d3
    .tip()
    .attr("class", "d3-tip")
    .offset([40, -60])
    .html(function(d) {

      // x key
      var theX;

      // Get the state name
      var theState = "<div>" + d.state + "</div>";

      // Get the y value's key and value
      var theY = "<div>" + curY + ": " + d[curY] + "%</div>";

      // If the x key is poverty
      if (curX === "poverty") {

        // Get the x key and a version of the value formatted to show percentage
        theX = "<div>" + curX + ": " + d[curX] + "%</div>";
      }
      else {

        // Get the x key and a version of the value formatted to include commas after every third digit
        theX = "<div>" +
          curX +
          ": " +
          parseFloat(d[curX]).toLocaleString("en") +
          "</div>";
      }
      // Return data captured
      return theState + theX + theY;
    });

  // Call the toolTip function
  svg.call(toolTip);

  // Change the min and max for x
  function xMinMax() {

    // Min will get the smallest datum from the selected column
    xMin = d3.min(theData, function(d) {
      return parseFloat(d[curX]) * 0.90;
    });

    // Max will get the largest datum from the selected column
    xMax = d3.max(theData, function(d) {
      return parseFloat(d[curX]) * 1.10;
    });
  }

  // Change the min and max for y
  function yMinMax() {

    // Min will get the smallest datum from the selected column
    yMin = d3.min(theData, function(d) {
      return parseFloat(d[curY]) * 0.90;
    });

    // Max will get the largest datum from the selected column
    yMax = d3.max(theData, function(d) {
      return parseFloat(d[curY]) * 1.10;
    });
  }

  // Change the classes (and appearance) of label text when clicked
  function labelChange(axis, clickedText) {

    // Switch currently active to inactive
    d3
      .selectAll(".aText")
      .filter("." + axis)
      .filter(".active")
      .classed("active", false)
      .classed("inactive", true);

    // Switch text just clicked to active
    clickedText.classed("inactive", false).classed("active", true);
  }

   // Get the min and max values of x and y
  xMinMax();
  yMinMax();

  // Create scales
  var xScale = d3
    .scaleLinear()
    .domain([xMin, xMax])
    .range([margin + labelArea, width - margin]);
  var yScale = d3
    .scaleLinear()
    .domain([yMin, yMax])
    .range([height - margin - labelArea, margin]);

  // Pass the scales into the axis methods to create the axes
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

  // Determine x and y tick counts
  function tickCount() {
    if (width <= 500) {
      xAxis.ticks(5);
      yAxis.ticks(5);
    }
    else {
      xAxis.ticks(10);
      yAxis.ticks(10);
    }
  }
  tickCount();

  // Append the axes in group elements
  svg
    .append("g")
    .call(xAxis)
    .attr("class", "xAxis")
    .attr("transform", "translate(0," + (height - margin - labelArea) + ")");
  svg
    .append("g")
    .call(yAxis)
    .attr("class", "yAxis")
    .attr("transform", "translate(" + (margin + labelArea) + ", 0)");

  // Make grouping for dots and their labels
  var theCircles = svg.selectAll("g theCircles").data(theData).enter();

  // Append the circles for each row of data
  theCircles
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[curX]);
    })
    .attr("cy", function(d) {
      return yScale(d[curY]);
    })
    .attr("r", circRadius)
    .attr("class", function(d) {
      return "stateCircle " + d.abbr;
    })

    // Create hover rules
    .on("mouseover", function(d) {

      // Show the tooltip
      toolTip.show(d, this);

      // Highlight the state circle's border
      d3.select(this).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {

      // Remove the tooltip
      toolTip.hide(d);

      // Remove highlight
      d3.select(this).style("stroke", "#e3e3e3");
    });

  // Get the state abbreviations from data
  theCircles
    .append("text")

    // Return the abbreviation to .text, which makes the text the abbreviation
    .text(function(d) {
      return d.abbr;
    })

    // Place the text using scale
    .attr("dx", function(d) {
      return xScale(d[curX]);
    })
    .attr("dy", function(d) {
      return yScale(d[curY]) + circRadius / 2.5;
    })
    .attr("font-size", circRadius)
    .attr("class", "stateText")

    // Hover Rules
    .on("mouseover", function(d) {

      // Show the tooltip
      toolTip.show(d);

      // Highlight the state circle's border
      d3.select("." + d.abbr).style("stroke", "#323232");
    })
    .on("mouseout", function(d) {

      // Remove tooltip
      toolTip.hide(d);

      // Remove highlight
      d3.select("." + d.abbr).style("stroke", "#e3e3e3");
    });

  //===========================
  // 4) Make the Graph Dynamic
  //===========================

  // Select all axis text and add this d3 click event
  d3.selectAll(".aText").on("click", function() {

    // Variable to save a selection of the clicked text
      var self = d3.select(this);

      if (self.classed("inactive")) {

      // Get the name and axis saved in label
      var axis = self.attr("data-axis");
      var name = self.attr("data-name");

      // When x is the saved axis, execute this:
      if (axis === "x") {

        // Make curX the same as the data name
        curX = name;

        // Change the min and max of the x-axis
        xMinMax();

        // Update the domain of x
        xScale.domain([xMin, xMax]);

        // Use a transition to update the xAxis
        svg.select(".xAxis").transition().duration(300).call(xAxis);

        // Update the location of the state circles
        d3.selectAll("circle").each(function() {

          d3
            .select(this)
            .transition()
            .attr("cx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Change the location of the state texts
        d3.selectAll(".stateText").each(function() {

          // Assign each state text the same motion as the matching circle
          d3
            .select(this)
            .transition()
            .attr("dx", function(d) {
              return xScale(d[curX]);
            })
            .duration(300);
        });

        // Change the classes of the last active label and the clicked label
        labelChange(axis, self);
      }
      else {
      
        // When y is the saved axis, execute this:
        // Make curY the same as the data name
        curY = name;

        // Change the min and max of the y-axis
        yMinMax();

        // Update the domain of y
        yScale.domain([yMin, yMax]);

        // Update Y Axis
        svg.select(".yAxis").transition().duration(300).call(yAxis);

        // Update the location of the state circles
        d3.selectAll("circle").each(function() {

          d3
            .select(this)
            .transition()
            .attr("cy", function(d) {
              return yScale(d[curY]);
            })
            .duration(300);
        });

        // Change the location of the state texts
        d3.selectAll(".stateText").each(function() {

          // Assign each state text the same motion as the matching circle
          d3
            .select(this)
            .transition()
            .attr("dy", function(d) {
              return yScale(d[curY]) + circRadius / 3;
            })
            .duration(300);
        });

        // Change the classes of the last active label and the clicked label
        labelChange(axis, self);
      }
    }
  });

//===========================
// 5)  Mobile Responsive
//===========================

  // Select window
  d3.select(window).on("resize", resize);

  // Specify what specific parts of the chart need size and position changes
  function resize() {

    // Redefine the width, height and leftTextY
    width = parseInt(d3.select("#scatter").style("width"));
    height = width - width / 3.9;
    leftTextY = (height + labelArea) / 2 - labelArea;

    // Apply the width and height to the svg canvas
    svg.attr("width", width).attr("height", height);

    // Change the xScale and yScale ranges
    xScale.range([margin + labelArea, width - margin]);
    yScale.range([height - margin - labelArea, margin]);

    // Update the axes
    svg
      .select(".xAxis")
      .call(xAxis)
      .attr("transform", "translate(0," + (height - margin - labelArea) + ")");

    svg.select(".yAxis").call(yAxis);

    // Update the ticks on each axis
    tickCount();

    // Update the labels
    xTextRefresh();
    yTextRefresh();

    // Update the radius of each dot
    crGet();

    // Update the location and radius of the state circles
    d3
      .selectAll("circle")
      .attr("cy", function(d) {
        return yScale(d[curY]);
      })
      .attr("cx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", function() {
        return circRadius;
      });

    // Change the location and size of the state texts
    d3
      .selectAll(".stateText")
      .attr("dy", function(d) {
        return yScale(d[curY]) + circRadius / 3;
      })
      .attr("dx", function(d) {
        return xScale(d[curX]);
      })
      .attr("r", circRadius / 3);
  }
}
