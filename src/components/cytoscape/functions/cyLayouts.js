import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";
import cola from "cytoscape-cola";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

Cytoscape.use(cola);

export const LAYOUTS = (nodeCount) => {
  const nodeRepuslionFactor = 400;
  const edgeLengthFactor = 0.1;

  const itterations = 100;
  const gravity = 10;
  const gravityCompound = 8;
  const gravityRangeCompound = 1.2;
  // const edgeElasticity = 0.1;
  const nestingFactor = 0;
  const gravityRange = 2;

  return {
    FCOSE: {
      name: "fcose",
      quality: "proof",
      animationDuration: 1000,
      nodeDimensionsIncludeLabels: true,
      randomize: false,
      fit: true,
      gravity: gravity,
      gravityRange: gravityRange,
      gravityCompound: gravityCompound,
      gravityRangeCompound: gravityRangeCompound,
      numIter: itterations,
      nodeRepulsion: function (node) {
        // return 1000;
        if (node.data().type === "stakeholderNode") {
          return nodeCount * nodeRepuslionFactor;
        } else {
          return 2;
        }
      },
      idealEdgeLength: function (edge) {
        // return 1000;
        if (edge.data().type === "stakeholderEdge") {
          return nodeCount * edgeLengthFactor;
        } else {
          return 300;
        }
      },
      // nestingFactor: nestingFactor,
      // edgeElasticity: (edge) => edgeElasticity,
      // initialTemp: 1000,
      // coolingFactor: 0.99,
      // nestingFactor: 0.3, //seems to make each wp more indipendant i.e. larger nodes float further away from center of graph
    },
    //run when chnage layout button is clicked, creates more 'drastic' layout chnage
    FCOSERandom: {
      name: "fcose",
      quality: "proof",
      animationDuration: 1000,
      nodeDimensionsIncludeLabels: true,
      randomize: true,
      fit: true,
      gravity: gravity,
      gravityRange: gravityRange,
      gravityCompound: gravityCompound,
      gravityRangeCompound: gravityRangeCompound,
      numIter: itterations,
      nodeRepulsion: function (node) {
        // return 1000;
        if (node.data().type === "stakeholderNode") {
          return nodeCount * nodeRepuslionFactor;
        } else {
          return 2;
        }
      },
      idealEdgeLength: function (edge) {
        // return 1000;
        if (edge.data().type === "stakeholderEdge") {
          return nodeCount * edgeLengthFactor;
        } else {
          return 300;
        }
      },
      // nestingFactor: nestingFactor,
      // edgeElasticity: (edge) => edgeElasticity,
      // // initialTemp: 1000,
      // // coolingFactor: 0.99,
      // // nestingFactor: 0.3,
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
