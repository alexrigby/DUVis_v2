import parseDataset from "./parseDataset";
import parseLinks from "./parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";
import convertMonthsToDates from "./datasetParseFunctions/convertMonthsToDates";
import makeGantchartItems from "./makeGantchartItems";
import convertDates from "./datasetParseFunctions/convertDates";
import makeCyWpNodes from "./cyElements/makeCyWpNodes";

export async function makeCyElements(datasetURL, linksURL, wpDatasetURL, datesURL) {
  const activityDataNoDate = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);
  const dates = await parseDataset(datesURL);

  const convertedDates = dates.map((d) => ({
    date: convertDates(d.date, null),
  }));

  //gets activity start and end dates converted to js format
  const { startDates, endDates } = convertMonthsToDates(activityDataNoDate, dates);
  //adds js readble start and end dates to activity array
  const activityData = activityDataNoDate.map((act, i) => ({
    ...act,
    startDate: startDates[i],
    endDate: endDates[i],
  }));

  const gantChartItems = makeGantchartItems(activityData, wpData);

  const nodes = makeCyNodes(activityData, dates);
  const edges = makeCyEdges(links);
  const wpNodes = makeCyWpNodes(wpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return {
    cyElms: cyElms,
    wpData: wpData,
    gantChartItems: gantChartItems,
    activityData: activityData,
    dates: convertedDates,
  };
}

export default makeCyElements;
