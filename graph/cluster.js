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

var svg = d3.select('svg'),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  transform = d3.zoomIdentity;

  svg.call(d3.zoom()
      .scaleExtent([1 / 2, 4])
      .on("zoom", zoomed));

// Invisible rectangle for zoom
  svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "black")
  .style("stroke-width", "5px")
  .style("fill", "none")
  .style("pointer-events", "none")

function zoomed() {
  d3.select('svg g').attr("transform", d3.event.transform);
}

var clusterLayout = d3.cluster()
  .size([width, height])
var root = d3.hierarchy(data)
clusterLayout(root)

// Nodes
var node = d3.select('svg g.nodes')
  .selectAll('g.nodeContainer')
  .data(root.descendants())
  .enter()

var circles = node.append("circle")
  .classed('node', true)
  .attr('r', 25)
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })

  .on('click', function(d, i) {
    // De-select all active nodes
    svg.selectAll('.activeCircle')
      .classed('activeCircle', false)
      .classed('node', true);

    // De-select all active links
    svg.selectAll('.activeLink')
      .classed('activeLink', false)
      .classed('link', true);

    var circle = d3.select(this)
      .classed('activeCircle', true)
      .classed('node', false);

    var links = svg.selectAll("line").filter(function(lineData) {
      if (lineData.source.data.name === d.data.name || lineData.target.data.name === d.data.name) {
        return true;
      };
    }).each(function() {
        d3.select(this)
        .classed('activeLink', true)
        .classed('link', false);
    });
  });

  node.append("text")
  .text(function(d) {
    return d.data.name;
  })
  .data(root.descendants())
  .attr("dy", 10)
  .attr("x", function(d) {
    return d.x;
  })
  .attr('y', function(d) {
    return d.y;
  });
  

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

