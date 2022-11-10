import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";
import cola from "cytoscape-cola";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

Cytoscape.use(cola);

export const LAYOUTS = (nodeCount, totalActCount, random) => {
  const nodeRepuslionFactor = 800;

  /// might be unnecicerily cnfusing
  // const reducerConst = totalActCount * 4;
  // const multiplier = (reducerConst - nodeCount) / 100; // need to teat if this works for diffrent sized graphs
  // const stakeholderedgelength = Math.pow(multiplier, 4);

  return {
    FCOSE: {
      uniformNodeDimensions: true,
      name: "fcose",
      quality: "proof",
      animationDuration: 1000,
      nodeDimensionsIncludeLabels: true,

      randomize: random,
      // fit: true,
      gravity: 10,
      gravityRange: 2,
      gravityCompound: 8,
      gravityRangeCompound: 1.2,
      numIter: 300,
      nodeRepulsion: function (node) {
        if (node.data().type === "stakehlderNode") {
          return nodeRepuslionFactor * nodeCount;
        } else {
          return nodeRepuslionFactor * nodeCount;
        }
      },
      idealEdgeLength: function (edge) {
        if (edge.data().type === "stakeholderEdge") {
          return 50;
        } else {
          return nodeCount * 4;
        }
      },
      edgeElasticity: (edge) => {
        if (edge.data().type === "stakeholderEdge") {
          return 0.4;
        } else {
          return 0.1;
        }
      },
    },

    COLA: {
      name: "cola",
      edgeLength: 2000, // sets edge length directly in simulation
      edgeJaccardLength: 2000, // jaccard edge length in simulation
      // nodeRepulsion: 6000,
      // idealEdgeLength: 200,
      // edgeElasticity: 0.2,
      // animationDuration: 1000,
    },
    COSEB: {
      name: "cose-bilkent",
    },
  };
};

export default LAYOUTS;

// circle: {
//       name: "concentric",
//       // nodeRepulsion: function (node) {
//       //   return 8000;
//       // },
//       // idealEdgeLength: function (edge) {
//       //   return 700;
//       // },
//       // fit: true, // whether to fit the viewport to the graph
//       // padding: 30, // the padding on fit
//       // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
//       // avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
//       // nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
//       // spacingFactor: 0.45, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
//       // radius: undefined, // the radius of the circle
//       // startAngle: (3 / 2) * Math.PI, // where nodes start in radians
//       // animate: true, // whether to transition the node positions
//       // animationDuration: 500, // duration of animation in ms if enabled
//       // animationEasing: undefined, // easing of animation if enabled
//       // transform: function (node, position) {
//       //   return position;
//       // }, // transform a given node position. Useful for changing flow direction in discrete layouts
//     },
