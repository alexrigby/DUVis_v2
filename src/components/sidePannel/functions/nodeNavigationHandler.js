import styleSelectedElements from "../../cytoscape/functions/styleSelectedElements";

export const nodeNavigationHandler = (nodeId, setSelectedNode, cyState) => {
  setSelectedNode(() => cyState.cy.nodes(`[id = "${nodeId}"]`).data());
  styleSelectedElements(cyState.cy, nodeId);
};

export default nodeNavigationHandler;
