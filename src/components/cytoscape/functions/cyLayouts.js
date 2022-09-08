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
    animationDuration: 500,
    nodeDimensionsIncludeLabels: true,
    // refresh: 400,
    // nodeRepulsion: (node) => 4500,
    idealEdgeLength: (edge) => 170,
    randomize: false,
    fit: true,
  },
  //run when chnage layout button is clicked, creates more 'drastic' layout chnage
  FCOSERandom: {
    name: "fcose",
    animationDuration: 1000,
    nodeDimensionsIncludeLabels: true,
    // nodeRepulsion: (node) => 4500,
    idealEdgeLength: (edge) => 170,
    randomize: true,
    fit: true,
  },
};

export default LAYOUTS;
