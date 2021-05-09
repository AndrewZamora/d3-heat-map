(async()=>{
    const data = await(await fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")).json();
    console.log(data)
})();