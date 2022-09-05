import parseDataset from "./datasetParseFunctions/parseDataset";
import parseLinks from "./linksParseFunctions/parseLinks";
import makeCyEdges from "./cyElements/makeCyEdges";
import makeCyNodes from "./cyElements/makeCyNodes";
import convertMonthsToDates from "./datasetParseFunctions/convertMonthsToDates";
import makeGantchartItems from "./makeGantchartItems";
import convertDates from "./datasetParseFunctions/convertDates";
import makeCyWpNodes from "./cyElements/makeCyWpNodes";
import getPRPeriods from "./getPRPeriods";
import giveActivityPrPeriod from "./giveActivtyPrPeriod";
import trimDataByPr from "./trimDataByPr";

export async function makeVisElements(datasetURL, linksURL, wpDatasetURL, datesURL, prPeriod) {
  const activityDataNoDate = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);
  const dates = await parseDataset(datesURL);

  const convertedDates = dates.map((d, i) => ({
    ...d,
    date: convertDates(d.date, null),
    // prPeriod: getPRPeriods(dates, i),
  }));
  // This function somehow mutes convertedDates-- works but might need chnaging!!!!
  getPRPeriods(convertedDates);

  //adds js readble start and end dates to activity array
  const activityData = activityDataNoDate.map((act, i) => ({
    ...act,
    startDate: convertMonthsToDates(act, dates, "start"),
    endDate: convertMonthsToDates(act, dates, "end"),
    startPrPeriod: giveActivityPrPeriod(act, convertedDates, "start"),
    endPrPeriod: giveActivityPrPeriod(act, convertedDates, "end"),
  }));

  const trimmedData = trimDataByPr(activityData, prPeriod);

  const gantChartItems = makeGantchartItems(trimmedData, wpData);

  const nodes = makeCyNodes(trimmedData);

  const edges = makeCyEdges(links, nodes);

  const wpNodes = makeCyWpNodes(wpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return {
    cyElms: cyElms,
    wpData: wpData,
    gantChartItems: gantChartItems,
    activityData: trimmedData,
    dates: convertedDates,
  };
}

export default makeVisElements;
