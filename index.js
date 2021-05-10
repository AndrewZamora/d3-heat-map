(async () => {
    const { monthlyVariance, baseTemperature } = await (await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")).json();
    const margin = { top: 40, right: 60, bottom: 40, left: 60 };
    const chartHeight = 400;
    const chartWidth = 800;
    const innerHeight = chartHeight - margin.top - margin.bottom;
    const innerWidth = chartWidth - margin.left - margin.right;
    const chartContainer = d3.select('div').append('svg').attr("height", chartHeight).attr("width", chartWidth);
    const chart = chartContainer.append('g').attr("transform", `translate(${margin.left},${margin.top})`);
    const yScale = d3.scaleLinear().range([innerHeight, 0]);
    yScale.domain([d3.max(monthlyVariance, d => d.month) - 1, 0]);
    const yAxis = d3.axisLeft(yScale).tickFormat(d => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return months[d];
    });
    chart.append('g').call(yAxis).attr("id", "y-axis").attr("transform", `translate(0,0)`)
    console.log(monthlyVariance)
})();