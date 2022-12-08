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
    // quality: "proof",
    // quality: currentActNodeCount < origionalActCount ? "default" : "proof",
    animationDuration: 1000,
    nodeDimensionsIncludeLabels: true,
    nodeRepulsion: function (node) {
      if (node.data().type === "stakeholderNode") {
        return nodeRepuslionFactor * currentActNodeCount;
      } else if (node.data().type === "project") {
        return nodeRepuslionFactor * currentActNodeCount * 10;
      } else {
        return 4000;
      }
    },
    idealEdgeLength: function (edge) {
      if (edge.data().type === "stakeholderEdge") {
        return 1;
      } else {
        return 300;
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
    gravity: 4,
    gravityCompound: 5.0,
    numIter: 300000,
    //   nodeRepulsion: function (node) {
    //     if (node.data().type === "stakehlderNode") {
    //       return nodeRepuslionFactor * currentActNodeCount;
    //     }
    //     // else if (node.data().type === "project") {
    //     //   return nodeRepuslionFactor * nodeCount * 4;
    //     // }
    //     else {
    //       return nodeRepuslionFactor * currentActNodeCount;
    //     }
    //   },
    //   idealEdgeLength: function (edge) {
    //     if (edge.data().type === "stakeholderEdge") {
    //       return 50;
    //     } else {
    //       return currentActNodeCount * 3;
    //     }
    //   },
    //   edgeElasticity: (edge) => {
    //     if (edge.data().type === "stakeholderEdge") {
    //       return 0.4;
    //     } else {
    //       return 0.1;
    //     }
    //   },
    // };
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
// // randomize: false,
//   fit: true,
//   nodeRepulsion: 3000,
//   idealEdgeLength: 300,
//   nesttingFactor: 0.4,
//   edgeElasticity: 0.1,
//   gravity: 4,
//   gravityCompound: 5,
//   // gravityRangeCompound: 1.5,
//   // gravityRange: 9,
//   initialEnergyOnIncremental: 1,
// });

export const CONCENTRIC = {
  name: "concentric",
  animate: true,
  animationDuration: 1000,
};
