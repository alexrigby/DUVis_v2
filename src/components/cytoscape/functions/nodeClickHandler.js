export const nodeClickHandler = (setSelectedNode, cyState, event) => {
  setSelectedNode((prevState) => (event.target.id() === prevState.id ? { id: "" } : event.target.data())); //update clickedNode state

  cyState.cy.edges().removeClass("connectedEdge"); //sets all edges back to default
  cyState.cy.nodes(`[id = "${event.target.id()}"]`).connectedEdges("edge").addClass("connectedEdge"); //adds class to edges connected to clicked node
};

export default nodeClickHandler;
