app.controller('ExploreController', ['$scope', function($scope) {
	$scope.main.displayHeader = true; 
	$scope.main.displayFullHeader = true; 
	$scope.main.selectedButton = 'explore';

// leaf nodes must have a "value" attribute
var ROOT_NAME = "All careers/skills/classes";

var data = {
  "name": ROOT_NAME,
  "depth": 0,
  "children": [
    {
      "name": "A1",
      "depth": "1",
      "children": [
        {
          "name": "B1",
          "depth": "2",   
          "children": [
            {
              "name": "CS106A",
               "depth": "3",
              "value": 100
            },
            {
              "name": "C2",
              "depth": "3",
              "value": 300
            },
            {
              "name": "C3",
              "depth": "3",
              "value": 200
            }
          ]
        },
        {
          "name": "B2",
          "depth": "2",
          "children": [
            {
              "name": "C4",
              "depth": "3",
              "value": 100
            }
          ]
        }
      ]
    },
    {
      "name" : "A2",
      "depth": "1",
      "children": [
        {
          "name" : "B2",
          "depth": "2",
          "children": [
          ]
        },
        {
          "name" : "B3", 
          "depth": "2",
          "children": [
          {
            "name" : "C5",
            "depth": "3",
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
  .style("pointer-events", "none");
 // .style("visibility", "hidden");

let url = "/getAllReviews";
var reviews;

remoteServiceGet(url).then((allReviews) => {
	reviews = JSON.parse(allReviews);

	// Add user-added careers, skills, and classes to our graph
	for (classID in reviews) {
		let reviewsForClass = reviews[classID];
		for (let j = 0; j < reviewsForClass.length; j++) {
			let review = reviewsForClass[j];
			let career = review.userInfo.career;
			let skills = review.skillsUseful;
			let elem = {"name": career, "depth": 1, "children": []};

			for (let i = 0; i < skills.length; i++) {
				let skill = skills[i];
				let skillElem = {"name": skill, "depth": 2, "children" : [{"name": classID, "depth": 3, "value": classID}]};
				elem.children.push(skillElem);
			}	
			data.children.push(elem);
		}
	}

	var dataWithoutDuplicates = removeDuplicates(data);

	var root = d3.hierarchy(dataWithoutDuplicates);
	var tree = d3.layout.tree();
	var nodes = tree.nodes(root).reverse();

	// Nodes
	var node = d3.select('svg g.nodes')
	  .selectAll('g.nodeContainer')
	  .data(nodes)
	  .enter()

	var circles = node.append("circle")
	  .attr('r', 40)
	  .attr('cx', function(d) {
	    return d.x * 1000;
	  })
	  .attr('cy', function(d) {
	    return d.y * 500;
	  })
	  .attr('class', function(d) {
	  	return replaceSpaces(d.data.name);
	  })
	  .style("visibility", function (d) { // Hide the root
	    return d.data.name === ROOT_NAME ? "hidden" : "visible";
	  })
	  .classed('node', true)
	  .on('click', function(d, i) {
	    let resetCircleToNonActive = d3.select(this).classed('activeCircle');

	    // De-select all active nodes
	    svg.selectAll('.activeCircle')
	      .classed('activeCircle', false)
	      .classed('node', true);

	    // De-select all active links
	    svg.selectAll('.activeLink')
	      .classed('activeLink', false)
	      .classed('link', true);

	    if (!resetCircleToNonActive) {
	      var circle = d3.select(this)
	        .classed('activeCircle', true)
	        .classed('node', false);

	      var links = svg.selectAll("line").filter(function(lineData) {
	        if (lineData.source.name === d.data.name || lineData.target.name === d.data.name) {
	          return true;
	        };
	      }).each(function() {
	          d3.select(this)
	          .classed('activeLink', true)
	          .classed('link', false);
	      });
	    }

	    if(d.data.value !== undefined) { // Class node has been clicked
	    	console.log("Once implemented, this will render the explore page right here");
	    }
	  });

	var text = node.append("text")
	  .text(function(d) {
	    return d.data.name;
	  })
	  .data(nodes)
	  .attr("dy", 6)
	  .attr("x", function(d) {
	    return d.x * 1000;
	  })
	  .attr('y', function(d) {
	    return d.y * 500;
	  })

	  .classed("nodeText", true)
	  .style("visibility", function (d) { // Hide the root's text
	    return d.data.name === ROOT_NAME ? "hidden" : "visible";
	  });

	let links = getLinks(data);

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

})
.catch(error => {
	console.log(error);
});

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
    var circle = d3.select("." + replaceSpaces(nodeName));
    return {x: circle.node().attributes.cx.value, 
      y: circle.node().attributes.cy.value};
} 

function replaceSpaces(name) {
	return name.replace(/\s+/g, '-');
}
}]);

