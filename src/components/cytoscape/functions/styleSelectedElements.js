export function styleSelectedElements(cy, nodeId, stakeholderSDisplay) {
  cy.nodes().removeClass("selectedNode");
  cy.nodes().removeClass("hilightedNode");
  cy.nodes("[type = 'stakeholderNode'] ").removeClass("show");
  cy.edges().removeClass("connectedEdge"); //sets all edges back to default
  cy.nodes(`[id = "${nodeId}"]`).addClass("selectedNode"); //gives seleted element red border
  cy.nodes(`[id = "${nodeId}"]`).connectedEdges().addClass("connectedEdge"); //adds class to edges connected to clicked node
  stakeholderSDisplay &&
    cy.nodes(`[id = "${nodeId}"]`).connectedEdges().connectedNodes("[type = 'stakeholderNode'] ").addClass("show");

  //horrible and hakey but cant find a better way with the vis-timeline
  document.querySelectorAll(`.vis-item`).forEach((el) => {
    el.classList.remove("selectedItem");
  });
  document.querySelectorAll(`.vis-item`).forEach((el) => {
    el.classList.remove("hilightedItem");
  });

  document.querySelectorAll(`.item${nodeId}`).forEach((el) => {
    el.classList.add("selectedItem");
  });
}

export default styleSelectedElements;
