import { wpFields } from "../../../data";

export function makeCyWpEdges(cy, wp) {
  // const wpData = wp.concat(
  //   {
  //   group: "nodes",
  //   classes: "wpNodes",
  //   id: "stakeholders",
  //   name: "All Stakeholders",
  // }
  // );
  const wpData = [...wp];
  // console.log(wpData);
  // loops over all WPs and returns an array of targets of the outgoing edges from that WP
  const wpTargetNodes = [];
  for (let i = 0; i < wpData.length; i++) {
    var targetNodes = getOutgoingEdgeTargets(cy, wpData[i][wpFields.ID]);
    wpTargetNodes[wpData[i][wpFields.ID]] = targetNodes;
  }

  const wpActIds = [];
  for (let i = 0; i < wpData.length; i++) {
    var d = getWpChildren(cy, wpData[i][wpFields.ID]);
    wpActIds[wpData[i][wpFields.ID]] = d;
  }

  //Finds all connections between workpackages and returns a weighted edge
  const wpEdges = [];

  for (let i = 0; i < wpData.length - 1; i++) {
    for (let j = i + 1; j < wpData.length; j++) {
      wpEdges.push({
        group: "edges",
        classes: "wpEdge",
        data: {
          id: `${wpData[i][wpFields.ID]}${wpData[j][wpFields.ID]}`,
          source: `${wpData[i][wpFields.ID]}`,
          target: `${wpData[j][wpFields.ID]}`,
          weight: wpConectionWeight(
            wpTargetNodes[`${wpData[i][wpFields.ID]}`],
            wpActIds[`${wpData[j][wpFields.ID]}`],
            wpTargetNodes[`${wpData[j][wpFields.ID]}`],
            wpActIds[`${wpData[i][wpFields.ID]}`]
          ),
          type: "wpEdge",
        },
      });
    }
  }

  return wpEdges;
}

//retunrs an array of edge targets from each wp
function getWpChildren(cy, wp) {
  var children = cy.nodes(`#${wp}`).children();
  return children.map((e) => e.id()); // returns targets of outgoing edges
}

//retunrs an array of edge targets from each wp
function getOutgoingEdgeTargets(cy, wp) {
  var edges = cy.nodes(`#${wp}`).children().connectedEdges();
  return edges.map((e) => e.data("target")); // returns targets of outgoing edges
}

//gets nodes connecting WPa and WPb and returns there 'weight' (i.e. how many connection there are between WPs)
function wpConectionWeight(array1, array2, array3, array4) {
  const cross1 = getCrossover(array1, array2);
  const cross2 = getCrossover(array3, array4);
  return cross1.length + cross2.length;
}

//check to see if how many ids cross between arrays therfore links between wps
function getCrossover(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}

export default makeCyWpEdges;
