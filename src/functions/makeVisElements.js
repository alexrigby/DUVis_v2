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
import trimData from "./trimData";

export async function makeVisElements(
  datasetURL,
  linksURL,
  wpDatasetURL,
  datesURL,
  prPeriod,
  storyIds,
  completedDisplay
) {
  const activityDataNoDate = await parseDataset(datasetURL);
  const links = await parseLinks(linksURL);
  const wpData = await parseDataset(wpDatasetURL);
  const dates = await parseDataset(datesURL);

  const convertedDates = dates.map((d, i) => ({
    ...d,
    date: convertDates(d.date, null),
  }));
  // This function somehow mutes convertedDates-- works but might need chnaging!!!!
  getPRPeriods(convertedDates);

  const latestPrPeriod = convertedDates[convertedDates.length - 1].prPeriod;

  //adds js readble start and end dates to activity array
  const activityData = activityDataNoDate.map((act, i) => ({
    ...act,
    startDate: convertMonthsToDates(act, dates, "start"),
    endDate: convertMonthsToDates(act, dates, "end"),
    startPrPeriod: giveActivityPrPeriod(act, convertedDates, "start"),
    endPrPeriod: giveActivityPrPeriod(act, convertedDates, "end"),
  }));

  //trims the data by filter option, used instead of raw data
  const trimmedData = trimData(activityData, prPeriod, storyIds);
  const trimmedWpData = wpData.filter((wp) => [...new Set(trimmedData.map((act) => act.WP))].includes(wp.id.slice(2)));

  const gantChartItems = makeGantchartItems(
    trimmedData,
    trimmedWpData,
    prPeriod,
    completedDisplay,
    latestPrPeriod,
    convertedDates
  );

  const nodes = makeCyNodes(trimmedData, prPeriod, completedDisplay, latestPrPeriod);

  const edges = makeCyEdges(links, nodes);

  const wpNodes = makeCyWpNodes(trimmedWpData);

  const cyElms = [nodes, edges.flat(), wpNodes].flat();

  return {
    cyElms: cyElms,
    wpData: trimmedWpData,
    gantChartItems: gantChartItems,
    activityData: trimmedData,
    dates: convertedDates,
  };
}

export default makeVisElements;
