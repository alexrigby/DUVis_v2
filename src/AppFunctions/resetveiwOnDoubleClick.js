export function resetVeiwOnDoubleClick(setSelectedNode, cyState) {
  setSelectedNode({ id: "" }); //sets selected node to "" so sidebar dosent display
  cyState.cy.nodes("[type = 'stakeholderNode'] ").removeClass("show"); // hide selected stakeholder nodes
  cyState.cy.edges().removeClass("connectedEdge"); //resets edges to default veiw
  cyState.cy.nodes().removeClass("selectedNode"); //resets nodes to default veiw

  document.querySelectorAll(`.vis-item`).forEach((el) => {
    el.classList.remove("selectedItem");
  });
}

export default resetVeiwOnDoubleClick;
