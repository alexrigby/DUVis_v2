import parseDataset from "./parseDataset";
import parseLinks from "./parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";

import makeCyWpNodes from "./cyElements/makeCyWpNodes";

export async function makeCyElements(datasetURL, linksURL, wpDatasetURL) {
  const nodeData = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);

  const nodes = makeCyNodes(nodeData);
  const edges = makeCyEdges(links);
  const wpNodes = makeCyWpNodes(wpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return { cyElms: cyElms, wpData: wpData };
}

export default makeCyElements;
