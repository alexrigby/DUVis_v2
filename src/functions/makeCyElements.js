import parseDataset from "./parseDataset";
import parseLinks from "./parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";

export async function makeCyElements(datasetURL, linksURL) {
  const nodeData = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);

  const nodes = makeCyNodes(nodeData);
  const edges = makeCyEdges(links);

  const cyElms = [nodes, edges.flat()].flat();

  return cyElms;
}

export default makeCyElements;
