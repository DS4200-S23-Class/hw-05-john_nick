/*
hw-05: Interactive Graph with D3
Modified: 02/19/2023
*/

const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};

const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

const FRAME1 = d3.select("#Scatterplot")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr('id', 'spsvg')
                    .attr("class", "frame");

// tracks new points.
let new_points = []

// adds new point to the graph
function new_point(){
  // reset graph if new points are being added
  document.getElementById("spsvg").innerHTML = '';
  d3.csv("data/scatter-data.csv").then((data) => {
    // get data from page
    let x_ele = document.getElementById('x_select');
    let y_ele = document.getElementById('y_select');
    // create new point in json
    new_points.push({x:x_ele.options[x_ele.selectedIndex].text, y:y_ele.options[y_ele.selectedIndex].text});
    let old_len = data.length;
    // update data list
    for (let i=0; i< new_points.length; i++)
    {
      data[old_len+i] = new_points[i];
    }
    // reconstruct graph with new data
    build_scatter_plot(true, data);
  });
}
function build_scatter_plot(addpoints, newdata) {

  d3.csv("data/scatter-data.csv").then((data) => {

    // fix new points into data if they were passed.
    if (addpoints){data=newdata;}

    // highlight point
    let mouseover = function(event, d) {
      d3.select(this)
          .style("fill", "orange");
    }

    // changes text to last point, and sets border depending on whether or not it is already present
    let mousedown = function(e, d) {
      if (e.target.getAttribute('stroke')==='black') {
        e.target
            .setAttribute("stroke", "none");
      }else {
        e.target
            .setAttribute("stroke", "black");
      }
      document.getElementById('point').textContent = `Last clicked point.. (${d['x']},${d['y']})`;
    }

    // resets point back to original color
    let mouseleave = function(event, d) {
      d3.select(this)
          .style("fill", "rgb(177, 41, 177)");
    }
    // find max X from the data 
    const MAX_X1 = d3.max(data, (d) => { return parseInt(d.x); });
    
    // Creates the scale function using data
    const X_SCALE1 = d3.scaleLinear() 
                      .domain([0, (MAX_X1)]) 
                      .range([0, VIS_WIDTH]); 

    // find max Y from the data 
    const MAX_Y1 = d3.max(data, (d) => { return parseInt(d.y); })
                      
    // Creates the scale function using data
    const Y_SCALE1 = d3.scaleLinear() 
                        .domain([0, MAX_Y1]) 
                        .range([VIS_HEIGHT, 0]); 
    
    // Plot Points using the X scale created above
    FRAME1.selectAll("points")  
        .data(data)  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE1(d.x) + MARGINS.left); }) 
          .attr("cy", (d) => { return (Y_SCALE1(d.y) + MARGINS.left); }) 
          .attr("r", 8)
          .attr("class", "point")
          .on("mouseover", mouseover)
          .on("mousedown", mousedown)
          .on("mouseleave", mouseleave);

    // Adds an X axis to the scatter plot
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE1).ticks(10)) 
            .attr("font-size", '20px'); 

    // Adds a Y axis to the scatter plot
    FRAME1.append("g") 
        .attr("transform", "translate(" + MARGINS.left + 
            "," + (MARGINS.bottom) + ")") 
        .call(d3.axisLeft(Y_SCALE1).ticks(10)) 
            .attr("font-size", '20px'); 


  });
}

const FRAME2 = d3.select("#Barplot")
                  .append("svg")
                    .attr("height", FRAME_HEIGHT)
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

function build_bar_plot() {

  d3.csv("data/bar-data.csv").then((data) => {

    let categories = data.map(function(value) { return value.category; });
    // creates a tooltip
    let Tooltip = d3.select("#Barplot")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // mouseover activates the tooltip to be seen
    let mouseover = function(d) {
      Tooltip
          .style("opacity", 1);
      d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
          .style("fill", "orange");
    }

    // mousemove keeps the tooltip next to the mouse
    let mousemove = function(event, d) {
      Tooltip
          .html("Value of bar: " + d.amount.toString())
          .style("left", (d3.pointer(event)[0]+50) + "px")
          .style("top", (d3.pointer(event)[1]+555) + "px");
    }

    // mouseleave makes tooltip transparent when outside a bar.
    let mouseleave = function(d) {
      Tooltip
          .style("opacity", 0);
      d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
          .style("fill", "blue");
    }

    // Creates the scale function using data
    const X_SCALE2 = d3.scaleBand()
                      .domain(categories)
                      .range([MARGINS.left, VIS_WIDTH])
                      .padding(0.2);
                      
    // find max Y from the data 
    const MAX_Y2 = d3.max(data, (d) => { return parseInt(d.amount); })
                      
    // Creates the scale function using data
    const Y_SCALE2 = d3.scaleLinear() 
                        .domain([0, MAX_Y2]) 
                        .range([VIS_HEIGHT, 0]); 

    // Plot Points using the X scale created above
    FRAME2.selectAll("bar")  
        .data(data)  
        .enter()       
        .append("rect")  
        .attr("class", "bar")
        .attr("x", (d) => { return X_SCALE2(d.category); }) 
        .attr("y", (d) => { return Y_SCALE2(d.amount); }) 
        .attr("width", X_SCALE2.bandwidth())
        .attr("height", (d) => { return (VIS_HEIGHT - Y_SCALE2(d.amount)); })
        .attr("fill", 'Blue')
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);


    FRAME2.append("g")
        .attr("transform", "translate(0," + VIS_HEIGHT + ")")
        .call(d3.axisBottom(X_SCALE2));

      FRAME2.append("g")
      .attr("transform", "translate(" + MARGINS.left + 
      "," + 0 + ")") 
        .call(d3.axisLeft(Y_SCALE2));
  });
}     

// Call function 
build_scatter_plot(false, []);
build_bar_plot();


