export function makeCyWpEdges(cy, wpData, wpActIds) {
  // loops over all WPs and returns an array of targets of the outgoing edges from that WP
  const wpTargetNodes = [];

  for (var i = 0; i < wpData.length; i++) {
    var targetNodes = getOutgoingEdgeTargets(cy, wpData[i].id);
    wpTargetNodes[wpData[i].id] = targetNodes;
  }

  //Finds all connections between workpackages and returns a weighted edge
  const wpEdges = [];

  // to iterate over the last element directly
  for (let i = 0; i < wpData.length - 1; i++) {
    // This is where you'll capture that last value
    for (let j = i + 1; j < wpData.length; j++) {
      wpEdges.push({
        group: "edges",
        classes: "wpEdge",
        data: {
          id: `${wpData[i].id}${wpData[j].id}`,
          source: `${wpData[i].id}`,
          target: `${wpData[j].id}`,
          weight: wpConectionWeight(
            wpTargetNodes[`${wpData[i].id}`],
            wpActIds[`${wpData[j].id}`],
            wpTargetNodes[`${wpData[j].id}`],
            wpActIds[`${wpData[i].id}`]
          ),
          type: "wpEdge",
        },
      });
    }
  }

  return wpEdges;
}

//retunrs an array of edge targets from each wp
function getOutgoingEdgeTargets(cy, wp) {
  var et = [];

  var edges = cy.nodes(`#${wp}`).children().connectedEdges();
  for (var i = 0; i < edges.length; i++) {
    var targets = edges[i].data("target");
    et.push(targets);
  }
  return et;
}

//gets nodes connecting WPa and WPb and returns there 'weight' (i.e. how many connection there are between WPs)
function wpConectionWeight(array1, array2, array3, array4) {
  const cros1 = getCrossover(array1, array2);
  const cros2 = getCrossover(array3, array4);
  return cros1.length + cros2.length;
}

function getCrossover(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}

export default makeCyWpEdges;
