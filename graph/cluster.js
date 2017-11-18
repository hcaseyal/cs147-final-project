var svg = d3.select('svg'),
  width = +svg.attr("width"),
  height = +svg.attr("height")

var data = {
  "name": "A1",
  "children": [
    {
      "name": "B1",
      "children": [
        {
          "name": "C1",
          "value": 100
        },
        {
          "name": "C2",
          "value": 300
        },
        {
          "name": "C3",
          "value": 200
        }
      ]
    },
    {
      "name": "B2",
      "children": [
        {
          "name": "C4",
          "value": 100
        }
      ]
    }
  ]
}

var clusterLayout = d3.cluster()
  .size([width, height])

var root = d3.hierarchy(data)

clusterLayout(root)

// Invisible rectangle for zoom
    svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("stroke", "black")
    .style("stroke-width", "5px")
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(d3.zoom()
        .scaleExtent([1 / 2, 4])
        .on("zoom", zoomed));

function zoomed() {
  var transform = d3.transform(d3.select('svg g').attr("transform"));
  
  d3.select('svg g').attr("transform", d3.event.transform);
}

// Nodes
d3.select('svg g.nodes')
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', function(d) {return d.x;})
  .attr('cy', function(d) {return d.y;})
  .attr('r', 25);

// Links
d3.select('svg g.links')
  .selectAll('line.link')
  .data(root.links())
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;});

