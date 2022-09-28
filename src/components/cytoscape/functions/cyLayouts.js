import COSEBilkent from "cytoscape-cose-bilkent";
import fcose from "cytoscape-fcose";
import Cytoscape from "cytoscape";

Cytoscape.use(COSEBilkent);

Cytoscape.use(fcose);

export const LAYOUTS = {
  FCOSE: {
    //cose-bilkent is a cytoscape plugin
    name: "fcose",
    // animate: false
    animationDuration: 1000,
    nodeDimensionsIncludeLabels: true,
    // refresh: 400,
    nodeRepulsion: function (node) {
      return 4000;
    },
    idealEdgeLength: function (edge) {
      return 300;
    },
    randomize: false,
    fit: true,
    gravity: 3,
    numIter: 100000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    // nestingFactor: 0.3, //seems to make each wp more indipendant i.e. larger nodes float further away from center of graph
  },
  //run when chnage layout button is clicked, creates more 'drastic' layout chnage
  FCOSERandom: {
    name: "fcose",
    animationDuration: 1000,
    nodeDimensionsIncludeLabels: true,
    nodeRepulsion: function (node) {
      return 4000;
    },
    idealEdgeLength: function (edge) {
      return 300;
    },
    randomize: true,
    fit: true,
    gravity: 3,
    numIter: 100000,
    initialTemp: 1000,
    coolingFactor: 0.99,
    // nestingFactor: 0.3,
  },
};

export default LAYOUTS;
