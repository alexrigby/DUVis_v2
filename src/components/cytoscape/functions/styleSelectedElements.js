export function styleSelectedElements(cy, node) {
  cy.nodes().removeClass("selectedNode");
  cy.edges().removeClass("connectedEdge"); //sets all edges back to default
  cy.nodes(`[id = "${node.id()}"]`).addClass("selectedNode"); //gives seleted element red border
  cy.nodes(`[id = "${node.id()}"]`).connectedEdges("edge").addClass("connectedEdge"); //adds class to edges connected to clicked node
}

export default styleSelectedElements;
