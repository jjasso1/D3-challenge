const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;


const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


d3.csv("assets/data/data.csv").then(function (Datafirst) {

  
  Datafirst.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });


  const xLinearScale = d3.scaleLinear()
    .domain([8, d3.max(Datafirst, d => d.poverty)])
    .range([0, width]);

  const yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(Datafirst, d => d.healthcare)])
    .range([height, 0]);

  
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);


  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  
  const circlesGroup = chartGroup.selectAll("circle")
    .data(Datafirst)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");
    
    chartGroup.selectAll("null")
    .data(Datafirst)
    .enter()
    .append("text")
    .text(function(x){
      return x.abbr
    })
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("text-anchor","middle")
    .attr("font-size",11)
  
  const toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
    });

  
  chartGroup.call(toolTip);

  
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("In Poverty"); 

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Lacks Healthcare (inches)");
}).catch(function (error) {
  console.log(error);
});
