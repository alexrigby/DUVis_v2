import parseDataset from "./parseDataset";
import parseLinks from "./parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";
import getWpActivitiesIds from "./getWpActivitiesIds";

import makeCyWpNodes from "./cyElements/makeCyWpNodes";

export async function makeCyElements(datasetURL, linksURL, wpDatasetURL) {
  const nodeData = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);

  const wpActivitiesIds = getWpActivitiesIds(nodeData, wpData);

  const nodes = makeCyNodes(nodeData);
  const edges = makeCyEdges(links);
  const wpNodes = makeCyWpNodes(wpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return { cyElms: cyElms, wpEdgeData: { wpActivitiesIds, wpData } };
}

export default makeCyElements;
