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
                    .attr("class", "frame"); 


function build_scatter_plot() {

  d3.csv("data/scatter-data.csv").then((data) => {

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
          .attr("class", "point");



    // Define event handler functions for mouseover event
    function handleMouseover(event, d) {
        console.log(d)
    }

    // function handleMousemove(event, d) {
    //   // position the tooltip and fill in information 
    //   TOOLTIP.html("Name: " + d.name + "<br>Value: " + d.x)
    //           .style("left", (event.pageX + 10) + "px") //add offset
    //                                                       // from mouse
    //           .style("top", (event.pageY - 50) + "px"); 
    // }

    // function handleMouseleave(event, d) {
    //   // on mouseleave, make transparant again 
    //   TOOLTIP.style("opacity", 0); 
    // } 

    // Add event listeners
    FRAME1.selectAll(".point")
          .on("mouseover", handleMouseover) 
        //   .on("mousemove", handleMousemove)
        //   .on("mouseleave", handleMouseleave);    

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

    var categories = data.map(function(value) { return value.category; });

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
        .attr("fill", 'Blue');


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
build_scatter_plot();
build_bar_plot();


