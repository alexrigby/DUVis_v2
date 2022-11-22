import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";
import cola from "cytoscape-cola";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

Cytoscape.use(cola);

export const FCOSE = (currentActNodeCount, origionalActCount, random) => {
  const nodeRepuslionFactor = 8000;
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
      if (node.data().type === "stakehlderNode") {
        return nodeRepuslionFactor * currentActNodeCount;
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

    //   uniformNodeDimensions: true,
    //   name: "fcose",
    //   quality: "proof",
    //   animationDuration: 1000,
    //   nodeDimensionsIncludeLabels: true,
    //   randomize: random,
    //   fit: true,
    //   gravityCompound: 10000000,
    //   gravityRangeCompound: 1,
    numIter: 300,
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

export const BCOSE = {
  name: "cose-bilkent",
  nodeDimensionsIncludeLabels: true,
  nodeRepulsion: 3000,
  idealEdgeLength: 20,
  nesttingFactor: 0.4,
  edgeElasticity: 0.1,
  gravity: 1,
  gravityRangeCompound: 1.5,
  gravityRange: 9,
};

export const CONCENTRIC = (ani) => ({
  name: "concentric",
  animate: ani,
  animationDuration: 1000,
});
