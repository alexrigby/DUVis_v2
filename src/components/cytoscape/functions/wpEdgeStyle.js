export function wpEdgeStyle(wp, cy) {
  const sourceWPNodes = getWpChildren(cy, wp.source);
  const targetWPNodes = getWpChildren(cy, wp.target);
  //   console.log(sourceWPNodes);

  const outgoingTargets = getOutgoingEdgeTargets(cy, wp.source);
  const incomingTargets = getOutgoingEdgeTargets(cy, wp.target);

  const weigth = wpConectionWeight(incomingTargets, sourceWPNodes, outgoingTargets, targetWPNodes);

  return weigth;
}

export default wpEdgeStyle;

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
  // console.log(array1, "1");
  // console.log(array2, "2");
  const cross1 = getCrossover(array1, array2);
  const cross2 = getCrossover(array3, array4);
  return cross1.length + cross2.length;
}

//check to see if how many ids cross between arrays therfore links between wps
function getCrossover(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}
