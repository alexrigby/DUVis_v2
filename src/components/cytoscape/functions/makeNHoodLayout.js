export function makeNHoodLayout(cyState, selectedNode) {
  cyState.cy.remove(cyState.cy.edges(`[network = "yes"]`)); //remove network nodes
  cyState.cy.remove(cyState.cy.nodes(`[network = "yes"]`)); //remove network nodes
  //gets neighboorhood of selected node and makes new nodes and edges
  const nHoodSNodes = cyState.cy
    .nodes(`#${selectedNode.label}`)
    .closedNeighborhood()
    .nodes("[type = 'stakeholderNode']");
  const nHoodActNodes = cyState.cy
    .nodes(`#${selectedNode.label}`)
    .closedNeighborhood()
    .nodes("[type = 'activityNode']");
  const nHoodSEdges = cyState.cy
    .nodes(`#${selectedNode.label}`)
    .closedNeighborhood()
    .edges("[type = 'stakeholderEdge']");

  const newNHoodSEdges = nHoodSEdges
    .map((e) => {
      return {
        group: "edges",
        classes: "networkEdge",
        data: {
          ...e.data(),
          id: "N_" + e.id(),
          source: "N_" + selectedNode.label,
          target: selectedNode.type === "stakeholderNode" ? "N_" + e.data().target : "N_" + e.data().source,
          network: "yes",
        },
      };
    })
    .filter((array) => array !== false);

  const newNHoodSNodes = nHoodSNodes.map((n) => ({
    group: "nodes",
    classes: "networkNode",
    data: {
      ...n.data(),
      parent: null,
      id: "N_" + n.data().label,
      network: "yes",
    },
    position: { x: 0, y: 0 },
  }));

  const newNHoodActNodes = nHoodActNodes.map((n) => {
    return {
      group: "nodes",
      classes: "networkNode",
      data: {
        ...n.data(),
        parent: null,
        id: "N_" + n.data().label,
        network: "yes",
      },
      position: { x: 0, y: 0 },
    };
  });

  const newNHoodActEdges =
    selectedNode.type !== "stakeholderNode"
      ? newNHoodActNodes // only make one edge for each activity node so all egeds point to the parent
          .map((n) => ({
            group: "edges",
            classes: "networkEdge",
            data: {
              id: `N_g${selectedNode.label}e${n.data.label}`,
              source: n.data.id,
              target: "N_" + selectedNode.label,
              network: "yes",
            },
          }))
          .filter((el) => el.data.target !== el.data.source)
      : [];

  //sort nodes by WP before adding to cytoscape
  newNHoodActNodes.sort(function (a, b) {
    return a.data.meta.WP - b.data.meta.WP;
  });

  return {
    ID: selectedNode.label,
    els: [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat(),
  };
}

export default makeNHoodLayout;
