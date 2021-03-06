var centerFunctionsByClass = {};
var lastSelectedTextNode;

app.controller('ExploreController', ['$scope', function($scope) {
	$scope.main.displayHeader = true; 
	$scope.main.displayFullHeader = true; 
	$scope.main.selectedButton = 'explore';

// leaf nodes must have a "value" attribute
var ROOT_NAME = "All careers/skills/classes";

var data = {
  "name": ROOT_NAME,
  "depth": 0,
  "children" : []
}

var svg = d3.select('svg'),
  width = +svg.attr("width"),
  height = +svg.attr("height"),
  transform = d3.zoomIdentity;

var zoom = d3.zoom()
      .scaleExtent([0.3, 2])
      .on("zoom", zoomed);

// Invisible rectangle for zoom
  var zoomer = svg.append("rect")
  .attr("width", width)
  .attr("height", height)
  .style("stroke", "#D3D3D3")
  .style("stroke-width", "5px")
  .style("fill", "none")
  .style("pointer-events", "all")
  .call(zoom);
  //.style("visibility", "hidden");

var g = svg.append('g');
var linkG = g.append("g");
var nodeG = g.append("g");

var p0 = [250, 200, 200],
    p1 = [500, 300, 600];

// svg.call(transition, p0, p1);

function transition(svg, start, end) {
  var center = [width / 2, height / 2],
      i = d3.interpolateZoom(start, end);

  svg
    .attr("transform", transform(start))
    .transition()
      .delay(250)
      .duration(i.duration * 2)
      .attrTween("transform", function() { return function(t) { return transform(i(t)); }; });

  function transform(p) {
    var k = height / p[2];
    return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
  }
}

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
			let elem = {"name": career, "type": "career", "depth": 1, "children": []};

			for (let i = 0; i < skills.length; i++) {
				let skill = skills[i];
				let skillElem = {"name": skill, "type": "skill", "depth": 2, "children" : [{"name": classID, "type": "classNode", "depth": 3, "value": classID}]};
				elem.children.push(skillElem);
			}	
			data.children.push(elem);
		}
	}

	var dataWithoutDuplicates = removeDuplicates(data);

	var root = d3.hierarchy(dataWithoutDuplicates);
	var tree = d3.layout.tree().separation(function(a, b) { 
    return (a.depth == b.depth) ? 2 : 1; 
  });

	var nodes = tree.nodes(root).reverse();

for (let i in nodes) {
  nodes[i].x *= 1000;
  nodes[i].y *= 500;

  nodes[i].x += 75;
  nodes[i].y -= 100;
}

// Nodes
var node = nodeG
  .selectAll('g.nodeContainer')
  .data(nodes)
  .enter()

var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([160, 0])
        .html(function(d) {
          return '<a class="course-button explore-graph-button" onclick="hideTip()" href="#!/class/' + d.data.name + '"> Class page for ' + d.data.name + '</a>' ;
        });

function hideTip() {
  tip.hide();
}


  // hack, but it works
  window.hideTip = hideTip;

  svg.call(tip);

	var circles = node.append("circle")
	  .attr('r', 40)
	  .attr('cx', function(d) {
	    return d.x;
	  })
	  .attr('cy', function(d) {
	    return d.y;
	  })
	  .attr('class', function(d) {
      centerFunctionsByClass[d.data.name] = function() {
        centerNode(d.x, d.y);
      }
	  	return replaceSpaces(d.data.name);
	  })
	  .style("visibility", function (d) { // Hide the root
	    return d.data.name === ROOT_NAME ? "hidden" : "visible";
	  })
	  .classed('career', function(d) {
      return d.data.type === "career";
    })
    .classed('skill', function(d) {
      return d.data.type === "skill";
    })
    .classed('classNode', function(d) {
      return d.data.type === "classNode";
    })
    .classed('node', true)
    .on('mouseover', function(d, i) {
      d3.select("#text-" + replaceSpaces(d.data.name)).style('color', 'white');
    })
    .on('mouseout', function(d, i) {
      let mousedOutNode = d3.select("#text-" + replaceSpaces(d.data.name));
      if (lastSelectedTextNode === undefined || mousedOutNode.node().id !== lastSelectedTextNode.node().id) {
        mousedOutNode.style('color', getTextColor(d.data.type));
      }
    })
	  .on('click', function(d, i) {
      tip.hide();

	    let resetCircleToNonActive = d3.select(this).classed('activeCircle');

	    // De-select all active nodes
	    svg.selectAll('.activeCircle')
	      .classed('activeCircle', false)
	      .classed('node', true)
        .classed('career', function(d) {
          return d.data.type === "career";
        })
        .classed('skill', function(d) {
          return d.data.type === "skill";
        })
        .classed('classNode', function(d) {
          return d.data.type === "classNode";
        });

	    // De-select all active links
	    svg.selectAll('.activeLink')
	      .classed('activeLink', false)
	      .classed('link', true);

        //5fb6eb
	    if (!resetCircleToNonActive) {
        if(lastSelectedTextNode !== undefined) {
          lastSelectedTextNode.style('color', getTextColor(d.data.type));
        }
        lastSelectedTextNode = d3.select("#text-" + replaceSpaces(d.data.name));
        lastSelectedTextNode.style('color', 'white');

	      var circle = d3.select(this)
	        .classed('activeCircle', true)
	        .classed('node', false)
          .classed('career', false)
          .classed('skill', false)
          .classed('classNode', false);

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
      else {
        lastSelectedTextNode = undefined;
      }

	    if(d.data.value !== undefined && !resetCircleToNonActive) { // Class node has been clicked
        tip.show(d, i);
	    }
	  });


function centerNode(xx, yy) {
   g.transition()
    .duration(500)
    .attr("transform", "translate(" + (width/2 - xx) + "," + (height/2 - yy) + ")scale(" + 1 + ")")
    .on("end", function(){ zoomer.call(zoom.transform, d3.zoomIdentity.translate((width/2 - xx),(height/2 - yy)).scale(1))});
}

  var side = 80;
	var text = node.append("foreignObject")
	  .data(nodes)
	  .attr("dy", 6)
	  .attr("x", function(d) {
	    return d.x - side / 2;
	  })
	  .attr('y', function(d) {
	    return d.y - side / 2;
	  })
    .attr("width", side)
    .attr("height", side)
	  .classed("nodeText", true)
    .classed('careerText', function(d) {
      return d.data.type === "career";
    })
    .classed('skillText', function(d) {
      return d.data.type === "skill";
    })
    .classed('classText', function(d) {
      return d.data.type === "classNode";
    })
	  .style("visibility", function (d) { // Hide the root's text
	    return d.data.name === ROOT_NAME ? "hidden" : "visible";
	  })
    .html(function(d) {
      return "<div class='divNodeText'> <p class=spanNodeText>" + d.data.name + "</p></div>";
    })
    .attr("id", function(d) {return "text-" + replaceSpaces(d.data.name); });

	let links = getLinks(data);

	// Links
	linkG
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
  g.attr("transform", d3.event.transform);
}

var clusterLayout = d3.cluster()
  .size([width, height])

function nodeNoChildren(node) {
  return {"name": node.name, "type": node.type, "children": []};
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

}]);

function getNodeColor(type) {
  if (type === "career") {
    return "#cfe9f9";
  }
  else if (type === "skill") {
    return "#C9DDFE";
  }
  else { //classNode 
    return "#C0D2F0";
  }
}

function getTextColor(type) {
  if (type === "careerText") {
    return "#5fb6eb";
  }
  else if (type === "skillText") {
    return "#2E7CFB";
  }
  else {
    return "#5283D5";
  }
} 

function replaceSpaces(name) {
  return name.replace(/\s+/g, '-');
}