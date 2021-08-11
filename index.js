(async () => {
    const { monthlyVariance, baseTemperature } = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")).json();
    const colors = ["blue", "green", "purple", "red", "aqua", "orange", "gray", "black", "pink"]
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const chartHeight = 400;
    const chartWidth = 800;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const innerWidth = chartWidth - margin.left - margin.right;
    const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
    const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3.scaleTime().range([0, innerWidth]);
    const yScale = d3.scaleBand().range([innerHeight, 0]);
    xScale.domain([(new Date(null)).setFullYear(d3.min(monthlyVariance, d => d.year) - 1), (new Date(null)).setFullYear(d3.max(monthlyVariance, d => d.year + 1))]);
    yScale.domain([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(10)).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => {
        return months[d];
    }).tickSizeOuter(0);
    chart.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    chart.append("g").call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`);
    const tooltip = d3.select("#title").append("div").attr("id", "tooltip").style("visibility", "hidden");
    chart
        .selectAll()
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr("class", "cell")
        .attr("x", d => {
            return xScale((new Date(null)).setFullYear(d.year))
        })
        .attr("y", d => {
            return yScale(d.month - 1)
        })
        .attr("data-month", d => d.month - 1)
        .attr("data-year", d => d.year)
        .attr("data-temp", d => d.variance + baseTemperature)
        .attr("width", d => {
            return "3px"
        })
        .attr("height", d => {
            return yScale.bandwidth()
        })
        .style("fill", d => {
            const temp = d.variance + baseTemperature
            if (temp > 11.7) {
                return colors[0]
            }
            if (temp > 10.6) {
                return colors[1]
            }
            if (temp > 9.5) {
                return colors[2]
            }
            if (temp > 8.3) {
                return colors[3]
            }
            if (temp > 7.2) {
                return colors[4]
            }
            if (temp > 6.1) {
                return colors[5]
            }
            if (temp > 5.0) {
                return colors[6]
            }
            if (temp > 3.9) {
                return colors[7]
            }
            return colors[8]
        })
        .on("mouseover", function (d) {
            const windowWidthOffset = (window.innerWidth - chartWidth) / 2;
            const windowHeightOffset = (window.innerHeight - chartHeight) / 2;
            tooltip
                .attr("data-year", d3.select(this).attr("data-year"))
                .style("position", "absolute")
                .style("font-size", "12px")
                .style("background", "#333")
                .style("color", "#FFF")
                .style("border-radius", "4px")
                .style("left", `${parseInt(d3.select(this).attr("x")) + windowWidthOffset + 70}px`)
                .style("top", `${(parseInt(d3.select(this).attr("y")) + windowHeightOffset)}px`)
                .style("visibility", "visible")
                .style("padding", "10px")
                .html(`${d.year} - ${months[d.month-1]} <br> Temp: ${(d.variance + baseTemperature).toFixed(1)}&#8451; <br> Variance: ${(d.variance > 0 ? "+" : '') + d.variance.toFixed(1)}&#8451;`)
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden")
        });
    const legend = d3.select('div').append("svg").attr("id", "legend").attr("height", "100px").attr("width", "500px");
    legend
        .append("g")
        .selectAll()
        .data(colors)
        .enter()
        .append('rect')
        .attr("fill", (d, index) => d)
        .attr("x", (d, index) => `${30 * index}px`)
        .attr("height", "30px")
        .attr("width", "30px")
    console.log(monthlyVariance, baseTemperature)
})();