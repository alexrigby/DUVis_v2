import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";
import cola from "cytoscape-cola";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

Cytoscape.use(cola);

export const FCOSE = (currentActNodeCount, random) => {
  const nodeRepuslionFactor = 1000;
  return {
    name: "fcose",
    animationDuration: 1000,
    nodeDimensionsIncludeLabels: true,
    nodeRepulsion: function (node) {
      if (node.data().type === "stakeholderNode") {
        return nodeRepuslionFactor * currentActNodeCount;
      } else if (node.data("type") === "activityNode") {
        return 0;
      } else {
        return 5000;
      }
    },
    idealEdgeLength: function (edge) {
      const sameParent = edge.connectedNodes()[0].data("parent") === edge.connectedNodes()[1].data("parent");
      if (edge.data("type") !== "stakeholderEdge") {
        return sameParent ? 100 : 500;
      } else {
        return 20;
      }
    },
    edgeElasticity: (edge) => {
      if (edge.data().type !== "stakeholderEdge") {
        return 0.1;
      } else {
        return 0.1;
      }
    },
    tile: (node) => {
      if (node.data().type !== "stakeholderNode") {
        return true;
      } else {
        return false;
      }
    },
    randomize: random,
    fit: true,
    gravity: 3.8, //attraction to the center of the graph
    gravityRange: 0.1,
    gravityCompound: 2000, //attraction to the center of the compound node
    gravityRangeCompound: 0.99,
    numIter: 300000,
  };
};

export const CONCENTRIC = {
  name: "concentric",
  animate: true,
  animationDuration: 1000,
};
