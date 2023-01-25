import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";
import cola from "cytoscape-cola";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

Cytoscape.use(cola);

export const FCOSE = (currentActNodeCount, origionalActCount, random) => {
  const nodeRepuslionFactor = 1000;
  /// might be unnecicerily cnfusing
  // const reducerConst = origionalActCount * 4;
  // const multiplier = (reducerConst - nodeCount) / 100; // need to teat if this works for diffrent sized graphs
  // const stakeholderedgelength = Math.pow(multiplier, 4);

  return {
    //cose-bilkent is a cytoscape plugin
    name: "fcose",
    // quality: currentActNodeCount < origionalActCount ? "default" : "proof",
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
      // return 150;
      if (edge.data("type") === "stakeholderEdge") {
        return 20; //1
      } else {
        if (edge.connectedNodes()[0].data("parent") === edge.connectedNodes()[1].data("parent")) {
          return 100;
        } else {
          return 500; //300
        }
      }
    },
    edgeElasticity: (edge) => {
      if (edge.data().type === "stakeholderEdge") {
        return 0.1;
      } else {
        return 0.1;
      }
    },
    tile: (node) => {
      if (node.data().type === "stakeholderNode") {
        return false;
      } else {
        return true;
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

export const COLA = {
  name: "cola",
  edgeLength: 2000, // sets edge length directly in simulation
  edgeJaccardLength: 2000, // jaccard edge length in simulation
  // nodeRepulsion: 6000,
  // idealEdgeLength: 200,
  // edgeElasticity: 0.2,
  // animationDuration: 1000,
};

// export const FCOSE = (currentActNodeCount, origionalActCount, random) => ({
//   name: "cose-bilkent",
//   nodeDimensionsIncludeLabels: true,
//   animationDuration: 1000,
//   randomize: random,
//   fit: true,
//   nodeRepulsion: 30000,
//   idealEdgeLength: 300,
//   nesttingFactor: 0.4,
//   edgeElasticity: 0.3,
//   gravity: 4,
// });

export const CONCENTRIC = {
  name: "concentric",
  animate: true,
  animationDuration: 1000,
};
