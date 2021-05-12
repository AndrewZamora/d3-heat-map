(async () => {
    const { monthlyVariance, baseTemperature } = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")).json();
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const chartHeight = 400;
    const chartWidth = 800;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const innerWidth = chartWidth - margin.left - margin.right;
    const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
    const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = d3.scaleTime().range([0, innerWidth]);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
    xScale.domain([(new Date(null)).setFullYear(d3.min(monthlyVariance, d => d.year) - 1), (new Date(null)).setFullYear(d3.max(monthlyVariance, d => d.year + 1))]);
    yScale.domain([d3.max(monthlyVariance, d => d.month), 0]);
    const xAxis = d3.axisBottom(xScale).ticks(d3.timeYear.every(10));
    const yAxis = d3.axisLeft(yScale).tickFormat(d => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[d];
    });
    chart.append("g").call(xAxis).attr("id", "x-axis").attr("transform", `translate(0,${innerHeight})`);
    chart.append("g").call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`)
    console.log(monthlyVariance)
})();