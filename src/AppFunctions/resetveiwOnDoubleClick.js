export function resetVeiwOnDoubleClick(setSelectedNode, cyState) {
  setSelectedNode({ id: "" }); //sets selected node to "" so sidebar dosent display
  cyState.cy.edges().removeClass("connectedEdge"); //resets edges to default veiw
  cyState.cy.nodes().removeClass("selectedNode"); //resets nodes to default veiw
}

export default resetVeiwOnDoubleClick;
