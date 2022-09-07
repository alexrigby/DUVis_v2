import COSEBilkent from "cytoscape-cose-bilkent";
import Cytoscape from "cytoscape";

Cytoscape.use(COSEBilkent);

export const LAYOUTS = {
  COSE: {
    //cose-bilkent is a cytoscape plugin
    name: "cose-bilkent",
    // animate: false
    animationDuration: 600,
    animate: "end",
    nodeDimensionsIncludeLabels: true,
    refresh: 400,
    nodeRepulsion: 10000,
    idealEdgeLength: 180,
    randomize: true,
    fit: true,
  },
};

export default LAYOUTS;
