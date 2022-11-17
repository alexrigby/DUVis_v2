import nodeTooltip from "./nodeTooltips";
import { CONCENTRIC } from "./LAYOUTS";

export function makeNHoodLayout(cyState, prevSelectedNode, selectedNode) {
  // deletes all neighborhood of previosuly selected node, is no node was selected nothing happens
  const newNhood = cyState.cy.elements(`#N_${prevSelectedNode.current.id}`).closedNeighborhood();
  cyState.cy.remove(newNhood);

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
            network: true,
          },
        }))
      : [];

  const newNHoodSNodes = nHoodSNodes.map((n) => ({
    group: "nodes",
    classes: "networkNodes",
    data: {
      ...n.data(),
      parent: null,
      id: "N_" + n.id(),
      network: true,
    },
  }));

  const newNHoodActNodes = nHoodActNodes.map((n) => ({
    group: "nodes",
    classes: "networkNodes",
    data: {
      ...n.data(),
      parent: null,
      id: "N_" + n.id(),
      network: true,
    },
  }));

  const newNHoodActEdges = newNHoodActNodes // only make one edge for each activity node so all egeds point to the parent
    .map((n) => ({
      group: "edges",
      classes: "networkEdge",
      data: {
        id: `N_g${selectedNode.id}e${n.data.id}`,
        source: n.data.id,
        target: "N_" + selectedNode.id,
        network: true,
      },
    }))
    .filter((el) => el.data.target !== el.data.source);

  const newNhoodElms = [newNHoodSNodes, newNHoodActNodes, newNHoodActEdges, newNHoodSEdges].flat();
  cyState.cy.nodes().addClass("hide"); // hide all nodes and there connected edges
  cyState.cy.add(newNhoodElms).layout(CONCENTRIC).run(); //add the new nodes to cytoscape and run concentric layout
  nodeTooltip(cyState.cy); //produces tooltips on mouuseover
}

export default makeNHoodLayout;
