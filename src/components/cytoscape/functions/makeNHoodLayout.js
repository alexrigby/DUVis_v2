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

  const newNHoodSEdges =
    selectedNode.type !== "stakeholderNode"
      ? nHoodSEdges.map((e) => ({
          group: "edges",
          classes: "networkEdge",
          data: {
            ...e.data(),
            id: "N_" + e.id(),
            source: "N_" + e.data().source,
            target: "N_" + selectedNode.label,
            network: "yes",
          },
        }))
      : [];

  const newNHoodSNodes = nHoodSNodes.map((n) => ({
    group: "nodes",
    classes: "networkNode",
    data: {
      ...n.data(),
      parent: null,
      id: "N_" + n.data().label,
      network: "yes",
    },
  }));

  const newNHoodActNodes = nHoodActNodes.map((n) => {
    // console.log(n.data().meta);
    return {
      group: "nodes",
      classes: "networkNode",
      data: {
        ...n.data(),
        parent: null,
        id: "N_" + n.data().label,
        network: "yes",
        // opacity: activityOpacity(n.data().meta, completedDisplay, latestPrPeriodRef.current, prPeriod), //need to dynamically set opacity when making new nodes
      },
    };
  });

  const newNHoodActEdges = newNHoodActNodes // only make one edge for each activity node so all egeds point to the parent
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
    .filter((el) => el.data.target !== el.data.source);

  //sort nodes by WP before adding to cytoscape
  newNHoodActNodes.sort(function (a, b) {
    return a.data.meta.WP - b.data.meta.WP;
  });

  console.log({
    ID: selectedNode.label,
    els: [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat(),
  });
  return { ID: selectedNode.label, els: [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat() };
}

export default makeNHoodLayout;
