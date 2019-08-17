// declaring a few initial variables
let world, projection, path, pathWorld, nodes;

// indicator used to color countries
let indName = 'Minimum Wage Provision';
let cartLog = false;



// colors for the categorical scale
let indDict = makeDict(indTitles, indOptionKey);
let colArr = ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', 'grey'];



// scale to color countries
let colScale = d3.scaleOrdinal()
                  .domain(['A', 'B', 'C', 'D', 'E', 'Z'])
                  .range(colArr);

let bubScale;

// defining projection for the map
projection = d3.geoRobinson()
              .scale(150 * 1.4)
              .center([-30,23]);

// path generating function
path = d3.geoPath()
        .projection(projection)

let SVG = d3.select('svg.worldMap');
let width = SVG.attr('width'),
    height = SVG.attr('height');

async function readAndDraw(){
  // read in data (world map, ILR indicators and world bank Labor force)
  world = await d3.json('worldMap3.topojson');
  let ilr = await d3.csv("LabCompInd/LabCompIndCode.csv");
  let WB = await d3.csv("LaborForce/labForceCenters.csv");

  // simplifying the topology for faster rendering
  world = topojson.presimplify(world);
  world = topojson.simplify(world, .15);

  // filter Antarctica from the world geometry
  world.objects.worldMap.geometries = world.objects.worldMap.geometries.filter(d => {
    return d.properties.ADMIN != "Antarctica";
  })

  // data with neighbors of all countries
  let neighbors = topojson.neighbors(world.objects.worldMap.geometries);
  // features of all countries from topjson
  nodes = topojson.feature(world, world.objects.worldMap).features;
  // Join data (ILR and WB)
  nodes = joinIndsLabData(nodes, ilr, WB);

  // extract labor force of countries and compute and radius scale
  let lF = nodes.map(d => d.data.WB ? +d.data.WB['2018'] : 0);
  let maxLF = d3.max(lF);

  bubScale = d3.scaleSqrt()
                  .domain([0, maxLF])
                  .range([0, 90]);

  nodes.forEach(function(node, i) {
    var centroid = path.centroid(node);

    node.x0 = centroid[0];
    node.y0 = centroid[1];
  });

  async function forceSimulate(){
    return new Promise(function(res){
      nodes.forEach(function(node) {
        node.x = node.x0;
        node.y = node.y0;
        node.r = bubScale(node.data.WB ? +node.data.WB['2018'] : 0);
      });

      var links = d3.merge(neighbors.map(function(neighborSet, i) {
        return neighborSet.filter(j => nodes[j]).map(function(j) {
          return {source: i, target: j, distance: nodes[i].r + nodes[j].r + 2};
        });
      }));

      simulation = d3.forceSimulation(nodes)
          // .force("cx", d3.forceX().x(d => width / 2).strength(0.1))
          // .force("cy", d3.forceY().y(d => height / 2).strength(0.1))
          //.force("link", d3.forceLink(links).distance(d => d.distance))
          .force("x", d3.forceX().x(d => d.x).strength(0.1))
          .force("y", d3.forceY().y(d => d.y).strength(0.1))
          .force("collide", d3.forceCollide().strength(0.6).radius(d => d.r + 2 ))
          .stop();

      while (simulation.alpha() > 0.01) {
        simulation.tick();
      }
      res();
    })
  }

  await forceSimulate();

  console.log(nodes);


  drawMap(SVG, nodes, indName);
}

readAndDraw();

function drawLegend(){
  let indOptions = indDict[indName];
  let indObjKeys = Object.keys(indOptions);

  let delayDuration = 100;

  let groupPadding = 15;
  let rectWidth = 20;

  d3.select('g.colLegend').remove();
  let colLegend = d3.select('svg')
                    .append('g')
                    .attr('class', 'colLegend')
                    .attr('transform', 'translate(10, 500)');

  let categGrps = colLegend.selectAll('g.categGroup')
                    .data(indObjKeys)
                    .enter()
                    .append('g')
                    .attr('class', 'categGroup')
                    .attr('transform', (d, i) => `translate(0, ${i * groupPadding})`)
                    .style('fill-opacity', 0);

  categGrps.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', rectWidth)
          .attr('height', groupPadding - 2)
          .style('fill', d => colScale(d));

  categGrps.append('text')
          .text(d => indOptions[d])
          .attr('x', rectWidth + 5)
          .attr('y', groupPadding - 4)
          .style('fill', 'white')
          .style('text-anchor', 'start')
          .style('font-size', '12px');

  categGrps.transition()
          .duration(delayDuration)
          .delay((d, i) => i * delayDuration)
          .style('fill-opacity', 1)
}

function makeNestCircLegend(CSSSelect = 'svg', transformArray, bubArray, bubScale, legendTitle){
  // appending a legendgroup
  d3.select('g.circLegendGroup').remove();

  let legendGroup = d3.select('svg')
                   .append('g')
                   .classed('circlegendGroup', true)
                   .attr('transform', `translate(${transformArray[0]}, ${transformArray[1]})`)

  //console.log(legendGroup);

  legendGroup.append('text')
           .text(legendTitle)
           .classed('legendTitle', true)
           .attr('dy', 50)
           .style('font-size', '13px')
           .style('fill', 'white')
           .style('text-anchor', 'center');

  let radius = bubScale(d3.max(bubArray));
  // hard code params such as Padding and font size for now
  let legLabelPadding = 5;
  let legLabFontSize = 12;

  const circGroups = legendGroup.selectAll('circle')
           .data(bubArray)
           .enter()
           .append('g')
           .classed('circLegendGroup', true)
           .attr('transform', d => `translate(0, ${radius - bubScale(d)})`);

  circGroups.append('circle')
           .attr('r', d => bubScale(d))
           .style('stroke', 'white')
           .style('fill', 'none')
           .style('stroke-width', '1px');

  circGroups.append('text')
           .text(d => d3.format(",")(d))
           .attr('dx', radius + legLabelPadding)
           .attr('dy', d => -(bubScale(d) - legLabFontSize/2))
           .style('fill', 'white')
           //.style('font-family', 'Montserrat')
           .style('font-size', `${legLabFontSize}px`)
}

function drawMap(svgSelect, nodes, indName){
  svgSelect.append('g')
          .attr('class', 'worldMapGroup')
          .selectAll('path.country')
          .data(nodes)
          .enter()
          .append('path')
          .attr('d', d => path(d))
          .attr('class', d => d.properties.ADM0_A3)
          .classed('country', true)
          .style('fill', d => {
            return d.data.ilr ? colScale(d.data.ilr[indName]) : 'grey';
          })
          .style('stroke', 'black')
          .style('stroke-width', '0.5px');

          drawLegend();

          actHov(d3.selectAll('path.country'));
}

function drawBubbles(svgSelect, nodes, indName, transTime){
  return new Promise(function(resolve){
    svgSelect.append('g')
            .attr('class', 'worldMapBubbles')
            .selectAll('circle.country')
            .data(nodes)
            .enter()
            .append('circle')
            .attr('class', d => d.properties.ADM0_A3)
            .classed('country', true)
            .attr('cx', d => d.x0)
            .attr('cy', d => d.y0)
            .attr('r', 0)
            .transition()
            .duration(transTime)
            .attr('r', d => d.r)
            .style('fill', d => {
              return d.data.ilr ? colScale(d.data.ilr[indName]) : 'grey';
            })
            .style('fill-opacity', 0.5)
            .on('end', resolve);
  })
}

function updatePaths(selection, timeTrans, strkCol, opacValue){
  return new Promise(function(resolve){
    selection.transition('pathOpac')
            .duration(timeTrans)
            .style('fill-opacity', opacValue)
            .style('stroke-opacity', opacValue)
            .on('end', resolve);
  })

}

function updateInd(selection, indicator, timeTrans){
  return new Promise(function(resolve){
    selection.transition('pathFill')
            .duration(timeTrans)
            .style('fill', d => {
              return d.data.ilr ? colScale(d.data.ilr[indicator]) : 'grey';
            })
            .on('end', resolve);

    drawLegend();
  })
}


function updateBubbles(selection, timeTrans, cartogram){
  return new Promise(function(resolve){
    selection.transition('bubbleTrans')
            .duration(timeTrans)
            .attr('cx', d => cartogram ? d.x : d.x0)
            .attr('cy', d => cartogram ? d.y : d.y0)
            .style('fill-opacity', d => cartogram ? 1 : 0.5)
            .attr('r', cartogram ? d => d.r : 0)
            .on('end', resolve);
  })

}

async function changeCarto(){

  let toCarto = !cartLog;
  cartLog = toCarto;

  if (toCarto == true){
    var carto_switch = document.getElementById("carto_switch");
    carto_switch.classList.add("mdc-switch--disabled");

    await updatePaths(d3.selectAll('path.country'), 1000 , 'black', 0.1);
    await drawBubbles(d3.select('svg'), nodes, indName, 1000)
    await updateBubbles(d3.selectAll('circle.country'), 1000, toCarto);

    // add legend
    makeNestCircLegend('svg', [50, 400], [25000000, 100000000], bubScale, 'Labor Force Size');
    deactHov(d3.selectAll('path.country'));
    actHov(d3.selectAll('circle.country'));

    carto_switch.classList.remove("mdc-switch--disabled");
  }
  else {
    let smallizeBub = updateBubbles(d3.selectAll('circle.country'), 1000, toCarto)
    smallizeBub.then(res => {
      d3.selectAll('circle.country').remove();
      deactHov(d3.selectAll('circle.country'));
      actHov(d3.selectAll('path.country'));
    });
    updatePaths(d3.selectAll('path.country'), 1000, 'black', 1)

    // remove legend
    d3.select('g.circLegendGroup').remove();
  }


  //await updateBubbles(selection, timeTrans, cartogram);
}

function getSingleInstanceChangeCarto(){
  let callInProgress;
  return async function(){
    if(callInProgress){
      //console.log('other call in progress')
      return;
    }

    //console.log('called changeCarto')

    callInProgress = true;
    await changeCarto();
    callInProgress = false;
  }
}

function drawCircVoronoi(nodes, dim){
  var voronoi = d3.voronoi()
    							.x(d => d.x)
    							.y(d => d.y)
    							.extent([[0, 0], dim])

  let polygonData = voronoi.polygons(nodes).filter(d => d);
  let polDatNodes = polygonData.map(d => d.data);


  function addClipPaths(svgSelect, clipIDFun){
    var polygon =  svgSelect.append("defs")
                        .selectAll(".clip")
                        .data(polygonData)
                        //First append a clipPath element
                        .enter().append("clipPath")
                        .attr("class", "clip")
                        //Make sure each clipPath will have a unique id (connected to the circle element)
                        .attr("id", clipIDFun)
                        //Then append a path element that will define the shape of the clipPath
                        .append("path")
                        .attr("class", "clip-path-circle")
                        .attr("d", function(d) { return "M" + d.join(",") + "Z"; })
  }

  addClipPaths(SVG, d => d.data.properties.ADM0_A3);

  //Append larger circles

  function addCircleCatchers(svgSelect, circleClassFun){
    var circleCatchers = svgSelect.selectAll(".circle-catcher")
        .data(polDatNodes)
        .enter().append("circle")
        .attr("class", circleClassFun)
        .classed("circle-catcher", true)
        //Apply the clipPath element by referencing the one with the same countryCode
        .attr("clip-path", d => "url(#" + d.properties.ADM0_A3)
        //Bottom line for safari, which doesn't accept attr for clip-path
        .style("clip-path", d => "url(#" + d.properties.ADM0_A3)
        .attr("cx", d => d.x)
        .attr("cy", d => d.y)
        //Make the radius a lot bigger
        //.attr("r", d => d.r >= 50 ? 90 : 50)
        .attr("r", d => d.r + (((90 - d.r)/90) * 40))
        .style("fill", "grey")
        .style("opacity", 0.5)
        .style("pointer-events", "all")
        //Notice that we now have the mousover events on these circles
        // .on("mouseover", activateHover(100))
        // .on("mouseout",  deactivateHover(100));
  }

  addCircleCatchers(SVG, d => d.properties.ADM0_A3);

}

function actHov(selection){
  selection.on('mouseover', function(d, i){
    d3.select(this).append('title')
      .text(d => d.properties.ADMIN)
  })

  selection.on('mouseout', function(d, i){
    d3.select(this).select('title').remove();
  })
}

function deactHov(selection){
  selection.on('mouseover', null)
  selection.on('mouseout', null)
}


let singleInstanceChangeCarto = getSingleInstanceChangeCarto();

d3.select('#indSelect').on('input', function(d, i){
    indName = this.value;
    updateInd(d3.selectAll('path'), indName, 1000);
    if (cartLog == true){
      updateInd(d3.selectAll('circle.country'), indName, 1000);
    }
})



function joinIndsLabData(nodes, ilr, WB){
  return nodes.map(country => {
    let ctryCode = country.properties.ADM0_A3;

    // introduce a new attribute that will hold ilr and WB
    country.data = {};

    let ilrFilt = ilr.filter(d => d['Map Code'] == ctryCode);
    let WBFilt = WB.filter(d => d['Country Code'] == ctryCode);

    country.data.ilr = ilrFilt.length > 0 ? ilrFilt[0] : null;
    country.data.WB = WBFilt.length > 0 ? WBFilt[0] : null;

    return country;
  })
}

function makeDict(keys, values){
  let dict = {};
  keys.forEach((d, i) => {
    dict[d] = values[i];
  });

  return dict;
}

function  listSelector(selectorID, array){
  let selectN = document.getElementById(selectorID);

  for (var i = 0; i < array.length; i++){
    var option = document.createElement('option'),
    text = document.createTextNode(array[i])

    option.appendChild(text);
    option.setAttribute('value', array[i]);
    selectN.insertBefore(option, selectN.lastChild);
  }
}

function randRange(min, max){
  return (Math.random() * (max - min) + min)
}

listSelector('indSelect', indTitles);
