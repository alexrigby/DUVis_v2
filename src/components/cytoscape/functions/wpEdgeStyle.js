export function wpEdgeStyle(wp, cy) {
  const targetNodes = getOutgoingEdgeTargets(cy, wp);
  const internalEdges = [];
  internalEdges.push(cy.nodes(`[parent = "${wp.source}"]`).connectedEdges().nodes(`[parent = "${wp.source}"]`));
  const wpChildren = getWpChildren(cy, wp);
  const childreRemoved = targetNodes.filter((n) => !wpChildren.includes(n));
  console.log(internalEdges);
  //   console.log(wpChildren, "chill");
  //   console.log(targetNodes, "notRemoved");
  //   console.log(childreRemoved, "removed");

  return 1;
}

export default wpEdgeStyle;

//retunrs an array of edge targets from each wp
function getOutgoingEdgeTargets(cy, wp) {
  var edges = cy.nodes(`#${wp.source}`).children().connectedEdges();
  return edges.map((e) => e.data("target")); // returns targets of outgoing edges
}

function getWpChildren(cy, wp) {
  var children = cy.nodes(`#${wp.source}`).children();
  return children.map((e) => e.id()); // returns targets of outgoing edges
}
