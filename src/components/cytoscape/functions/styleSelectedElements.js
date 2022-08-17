export function styleSelectedElements(cy, nodeId) {
  console.log(nodeId);
  cy.nodes().removeClass("selectedNode");
  cy.edges().removeClass("connectedEdge"); //sets all edges back to default
  cy.nodes(`[id = "${nodeId}"]`).addClass("selectedNode"); //gives seleted element red border
  cy.nodes(`[id = "${nodeId}"]`).connectedEdges("edge").addClass("connectedEdge"); //adds class to edges connected to clicked node
}

export default styleSelectedElements;
