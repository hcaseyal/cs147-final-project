// README: Currently, all careers should have at least
// one unique skill, and skills should have at least
// one unique class. Otherwise, the layout isn't accurate :'(

var data = {
  "name": "All careers/skills/classes",
  "children": [
    {
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
    },
    {
      "name" : "A2",
      "children": [
        {
          "name" : "B2",
          "children": [
          ]
        },
        {
          "name" : "B3", 
          "children": [
          {
            "name" : "C5",
            "children": [
            ]
          }
          ]
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

function nodeNoChildren(node) {
  return {"name": node.name, "children": []};
}

function removeDuplicates(data) {
  let map = {};
  let dataNoDups = nodeNoChildren(data);

  for (careerIndex in data.children) {
    let careerNode = data.children[careerIndex];
    let careerKey = careerNode.name;
    if (!(careerKey in map)) {
      map[careerKey] = true;
      dataNoDups.children.push(nodeNoChildren(careerNode));
    }
    for (skillIndex in careerNode.children) {
      let skillNode = careerNode.children[skillIndex];
      let skillKey = skillNode.name;
      if (!(skillKey in map)) {
        map[skillKey] = true;
        addSkill(skillNode, careerNode, dataNoDups);
      }

      for (classIndex in skillNode.children) {
        let classNode = skillNode.children[classIndex];
        let classKey = classNode.name;

        if (!(classKey in map)) {
          map[classKey] = true;
          addClass(classNode, skillNode, dataNoDups);
        }
      }
    }
  }

  function addSkill(skillNode, careerNode, dataNoDups) {
      for (careerIndex in dataNoDups.children) {
        let tempCareerNode = dataNoDups.children[careerIndex];
        if (careerNode.name === tempCareerNode.name) {
          dataNoDups.children[careerIndex].children.push(nodeNoChildren(skillNode));
          return;
        }
      }
  }

  function addClass(classNode, skillNode, dataNoDups) {
    for (careerIndex in dataNoDups.children) {
      let careerNode = dataNoDups.children[careerIndex];
      for (skillIndex in careerNode.children) {
        let tempSkillNode = careerNode.children[skillIndex];

        // Found existing skill in data that corresponds to
        // the parent skill of the class we want to add
        if (tempSkillNode.name === skillNode.name) {
          dataNoDups.children[careerIndex].children[skillIndex].children.push(classNode);
          return;
        }
      }
    }
  }
  return dataNoDups;
}

var dataWithoutDuplicates = removeDuplicates(data);
var root = d3.hierarchy(dataWithoutDuplicates)
clusterLayout(root)

// Nodes
var node = d3.select('svg g.nodes')
  .selectAll('g.nodeContainer')
  .data(root.descendants())
  .enter()

var circles = node.append("circle")
  .attr('r', 25)
  .attr('cx', function(d) {
    return d.x;
  })
  .attr('cy', function(d) {
    return d.y;
  })
  .attr('class', function(d) {
    return d.data.name;
  })
  .classed('node', true)
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

let links = getLinks(data); //root.links();

// Links
d3.select('svg g.links')
  .selectAll('line.link')
  .data(links)
  .enter()
  .append('line')
  .classed('link', true)
  .attr('x1', function(d) {return d.source.x;})
  .attr('y1', function(d) {return d.source.y;})
  .attr('x2', function(d) {return d.target.x;})
  .attr('y2', function(d) {return d.target.y;});

function getLinks(data) {
  let links = [];
  for (careerIndex in data.children) {
    let careerNode = data.children[careerIndex];

    for (skillIndex in careerNode.children) {
      let skillNode = careerNode.children[skillIndex];
      links.push(constructLink(careerNode.name, skillNode.name));

      for (classIndex in skillNode.children) {
        let classNode = skillNode.children[classIndex];
        links.push(constructLink(skillNode.name, classNode.name));
      }
    }
  }

  function constructLink(sourceName, destName) {
    // Link looks like:
    // {source: {x: 120, y: 100, name: "A1"}, target: {x: 150, y: 200, "name": "A2"}})

    let link = {source: {}, target: {}};
    link.source.name = sourceName;
    link.target.name = destName;

    sourceCoords = getCoords(sourceName);
    destCoords = getCoords(destName);

    link.source.x = sourceCoords.x;
    link.source.y = sourceCoords.y;

    link.target.x = destCoords.x;
    link.target.y = destCoords.y;

    return link;
  }

  return links;
}

function getCoords(nodeName) {
    var circle = d3.select("." + nodeName);
    return {x: circle.node().attributes.cx.value, 
      y: circle.node().attributes.cy.value};
} 
