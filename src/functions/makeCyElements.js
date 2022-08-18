import parseDataset from "./parseDataset";
import parseLinks from "./parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";
import convertDates from "./datasetParseFunctions/convertDates";
import makeGantchartItems from "./makeGantchartItems";

import makeCyWpNodes from "./cyElements/makeCyWpNodes";

export async function makeCyElements(datasetURL, linksURL, wpDatasetURL, datesURL) {
  const activityDataNoDate = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);
  const dates = await parseDataset(datesURL);

  const convertedDates = convertDates(activityDataNoDate, dates);
  //adds js readble start and end dates to activity array
  const activityData = activityDataNoDate.map((act, i) => ({
    ...act,
    startDate: convertedDates.startDates[i],
    endDate: convertedDates.endDates[i],
  }));

  const gantChartItems = makeGantchartItems(activityData, wpData);

  const nodes = makeCyNodes(activityData, dates);
  const edges = makeCyEdges(links);
  const wpNodes = makeCyWpNodes(wpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return { cyElms: cyElms, wpData: wpData, gantChartItems: gantChartItems };
}

export default makeCyElements;
