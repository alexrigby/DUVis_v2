import parseDataset from "./datasetParseFunctions/parseDataset";
import parseLinks from "./linksParseFunctions/parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";
import convertMonthsToDates from "./datasetParseFunctions/convertMonthsToDates";
import makeGantchartItems from "./makeGantchartItems";
import convertDates from "./datasetParseFunctions/convertDates";
import makeCyWpNodes from "./cyElements/makeCyWpNodes";
import getPRPeriods from "./getPRPeriods";

export async function makeVisElements(datasetURL, linksURL, wpDatasetURL, datesURL) {
  const activityDataNoDate = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);
  const dates = await parseDataset(datesURL);

  const convertedDates = dates.map((d) => ({
    date: convertDates(d.date, null),
  }));

  //adds prPeriod to each date entry
  const datesAndPRperiod = getPRPeriods(convertedDates);

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
    dates: datesAndPRperiod,
  };
}

export default makeVisElements;
