import COSEBilkent from "cytoscape-cose-bilkent";
import Cytoscape from "cytoscape";

Cytoscape.use(COSEBilkent);

export const LAYOUTS = {
  COSE: {
    //cose-bilkent is a cytoscape plugin
    name: "cose-bilkent",
    // animate: false
    animationDuration: 800,
    animate: "end",
    nodeDimensionsIncludeLabels: true,
    refresh: 400,
    nodeRepulsion: 8000,
    idealEdgeLength: 180,
    randomize: true,
    fit: true,
    edgeElasticity: 0.9,
    nestingFactor: 0,
    gravity: 0.9,
    gravityRangeCompound: 10,
    initialEnergyOnIncremental: 0.9,
  },
};

export default LAYOUTS;
