(async () => {
  const { monthlyVariance, baseTemperature } = await (
    await fetch(
      "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
    )
  ).json();
  const colorScale = d3.scaleLinear().domain([3, 7, 12]).range(["cornflowerblue", "orange", "red"])
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const temps = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];
  const margin = { top: 40, right: 80, bottom: 40, left: 80 };
  const chartHeight = 400;
  const chartWidth = 1000;
  const innerHeight = chartHeight - margin.top - margin.bottom;
  const innerWidth = chartWidth - margin.left - margin.right;
  const chartContainer = d3
    .select("#chart-container")
    .append("svg")
    .attr("height", chartHeight)
    .attr("width", chartWidth);
  const chart = chartContainer
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  const xScale = d3.scaleTime().range([0, innerWidth]);
  const yScale = d3.scaleBand().range([innerHeight, 0]);
  xScale.domain([
    new Date(null).setFullYear(d3.min(monthlyVariance, (d) => d.year) - 1),
    new Date(null).setFullYear(d3.max(monthlyVariance, (d) => d.year + 1)),
  ]);
  yScale.domain([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(d3.timeYear.every(10))
    .tickSizeOuter(0);
  const yAxis = d3
    .axisLeft(yScale)
    .tickFormat((d) => {
      return months[d];
    })
    .tickSizeOuter(0);
  chart
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .append("text")
    .text("Months")
    .attr("fill", "#333")
    .attr("transform", `rotate(-90)`)
    .attr("x", `${innerHeight / 2}`)
    .attr("y", "-70");
  chart
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(0,0)`)
    .append("text")
    .text("Years")
    .attr("fill", "#333")
    .attr("x", `${innerWidth / 2}`)
    .attr("y", `${innerHeight + 30}`);
  const tooltip = d3
    .select("#chart-container")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden");
  chart
    .selectAll()
    .data(monthlyVariance)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", (d) => {
      // Subtracting 2 gets data rects flush with the y axis (might be an issue with the way I'm setting the date object)
      return xScale(new Date(null).setFullYear(d.year)) - 2 ;
    })
    .attr("y", (d) => {
      return yScale(d.month - 1);
    })
    .attr("data-month", (d) => d.month - 1)
    .attr("data-year", (d) => d.year)
    .attr("data-temp", (d) => d.variance + baseTemperature)
    .attr("width", (d) => {
      return "4px";
    })
    .attr("height", (d) => {
      return yScale.bandwidth();
    })
    .style("fill", (d) => {
      const temp = d.variance + baseTemperature;
      return `${colorScale(temp)}`;
    })
    .on("mouseover", function (d) {
      const [mouseX, mouseY] = d3.mouse(this);
      tooltip
        .attr("data-year", d3.select(this).attr("data-year"))
        .style("position", "absolute")
        .style("font-size", "12px")
        .style("background", "#333")
        .style("color", "#FFF")
        .style("border-radius", "4px")
        .style("left", `${Math.ceil(mouseX)}px`)
        .style("top", `${Math.ceil(mouseY) - 40}px`)
        .style("visibility", "visible")
        .style("padding", "10px")
        .html(
          `${d.year} - ${months[d.month - 1]} <br> Temp: ${(
            d.variance + baseTemperature
          ).toFixed(1)}&#8451; <br> Variance: ${(d.variance > 0 ? "+" : "") + d.variance.toFixed(1)
          }&#8451;`
        );
    })
    .on("mouseout", () => {
      tooltip.style("visibility", "hidden");
    });
  const legend = d3
    .select("div")
    .append("svg")
    .attr("id", "legend")
    .attr("height", "100px")
    .attr("width", "500px")
  legend
    .append("g")
    .selectAll()
    .data(temps)
    .enter()
    .append("rect")
    .attr("fill", (d, index) => d === temps[temps.length - 1] ? 'transparent' :`${colorScale(temps[index])}`)
    .attr("x", (d, index) => `${30* index}`)
    .attr("height", "30px")
    .attr("width", "30px")
    .attr("transform", `translate(30,0)`);
  const legendXScale = d3.scaleLinear().range([0, (30 * temps.length)-30]);
  legendXScale.domain([0, temps.length - 1]);
  const legendXAxis = d3.axisBottom(legendXScale).tickFormat((d) => {
    return temps[d];
  })
  legend.append("g").call(legendXAxis).attr("transform", `translate(30,${30})`);
  console.log(monthlyVariance, baseTemperature);
})();
