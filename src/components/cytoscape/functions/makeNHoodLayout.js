import nodeTooltip from "./nodeTooltips";
import { CONCENTRIC } from "./LAYOUTS";

export function makeNHoodLayout(cyState, selectedNode) {
  //gets neighboorhood of selected node and makes new nodes and edges
  const nHoodSNodes = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood().nodes("[type = 'stakeholderNode']");
  const nHoodActNodes = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood().nodes("[type = 'activityNode']");
  const nHoodSEdges = cyState.cy.nodes(`#${selectedNode.id}`).closedNeighborhood().edges("[type = 'stakeholderEdge']");

  const newNHoodSEdges =
    selectedNode.type !== "stakeholderNode"
      ? nHoodSEdges.map((e) => ({
          group: "edges",
          classes: "networkEdge",
          data: {
            ...e.data(),
            id: "N_" + e.id(),
            source: "N_" + e.data().source,
            target: "N_" + selectedNode.id,
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
      id: "N_" + n.id(),
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
        id: "N_" + n.id(),
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
        id: `N_g${selectedNode.id}e${n.data.id}`,
        source: n.data.id,
        target: "N_" + selectedNode.id,
        network: "yes",
      },
    }))
    .filter((el) => el.data.target !== el.data.source);

  //sort nodes by WP before adding to cytoscape
  newNHoodActNodes.sort(function (a, b) {
    return a.data.meta.WP - b.data.meta.WP;
  });

  return [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat();
}

export default makeNHoodLayout;
