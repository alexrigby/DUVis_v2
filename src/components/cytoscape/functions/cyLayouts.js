import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

export const LAYOUTS = (nodeCount) => {
  const nodeRepuslionFactor = 35;
  const edgeLengthFactor = 5.5;

  return {
    FCOSE: {
      //cose-bilkent is a cytoscape plugin
      name: "fcose",
      // animate: false
      animationDuration: 1000,
      nodeDimensionsIncludeLabels: true,
      // refresh: 400,
      nodeRepulsion: function (node) {
        if (node.data().type === "stakeholderNode") {
          return nodeCount * nodeRepuslionFactor;
        } else {
          return 4000;
        }
      },
      idealEdgeLength: function (edge) {
        if (edge.data().type === "stakeholderEdge") {
          return nodeCount * edgeLengthFactor;
        } else {
          return 300;
        }
      },
      edgeElasticity: (edge) => 0.1,
      randomize: false,
      fit: true,
      gravity: 4,
      gravityCompound: 5.0,
      // numIter: 100000,
      // initialTemp: 1000,
      // coolingFactor: 0.99,
      // nestingFactor: 0.3, //seems to make each wp more indipendant i.e. larger nodes float further away from center of graph
    },
    //run when chnage layout button is clicked, creates more 'drastic' layout chnage
    FCOSERandom: {
      name: "fcose",
      animationDuration: 1000,
      nodeDimensionsIncludeLabels: true,
      nodeRepulsion: function (node) {
        if (node.data().type === "stakeholderNode") {
          return nodeCount * nodeRepuslionFactor;
        } else {
          return 4000;
        }
      },
      idealEdgeLength: function (edge) {
        if (edge.data().type === "stakeholderEdge") {
          return nodeCount * edgeLengthFactor;
        } else {
          return 300;
        }
      },
      edgeElasticity: (edge) => 0.1,
      randomize: true,
      fit: true,
      gravity: 3,
      gravityCompound: 5.0,
      // numIter: 100000,
      // initialTemp: 1000,
      // coolingFactor: 0.99,
      // nestingFactor: 0.3,
    },
    circle: {
      name: "concentric",
      // nodeRepulsion: function (node) {
      //   return 8000;
      // },
      // idealEdgeLength: function (edge) {
      //   return 700;
      // },
      // fit: true, // whether to fit the viewport to the graph
      // padding: 30, // the padding on fit
      // boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
      // avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
      // nodeDimensionsIncludeLabels: true, // Excludes the label when calculating node bounding boxes for the layout algorithm
      // spacingFactor: 0.45, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
      // radius: undefined, // the radius of the circle
      // startAngle: (3 / 2) * Math.PI, // where nodes start in radians
      // animate: true, // whether to transition the node positions
      // animationDuration: 500, // duration of animation in ms if enabled
      // animationEasing: undefined, // easing of animation if enabled
      // transform: function (node, position) {
      //   return position;
      // }, // transform a given node position. Useful for changing flow direction in discrete layouts
    },
  };
};

export default LAYOUTS;
