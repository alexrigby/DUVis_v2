import styleSelectedElements from "../../cytoscape/functions/styleSelectedElements";

export const nodeNavigationHandler = (nodeId, setSelectedNode, cyState, setStakeholdersDisplay) => {
  setStakeholdersDisplay((prevState) =>
    cyState.cy.nodes(`[id = "${nodeId}"]`).data("type") === "stakeholderNode" ? false : prevState
  );
  setSelectedNode(() => cyState.cy.nodes(`[id = "${nodeId}"]`).data());
  cyState.cy.nodes().removeClass("hilightedNode");
  document.querySelectorAll(`.vis-item`).forEach((el) => {
    el.classList.remove("hilightedItem");
  });
  styleSelectedElements(cyState.cy, nodeId);
};

export default nodeNavigationHandler;
