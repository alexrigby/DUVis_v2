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
import parseTDRMatrix from "./TDRParseFucntions/parseTDRMatrix";
import makeCyStakeholerNodes from "./cyElements/makeCyStakeholderNodes";
import makeStakeholderCyEdges from "./cyElements/makeStakeholderCyEdges";

export async function makeVisElements(
  datasetURL,
  linksURL,
  wpDatasetURL,
  datesURL,
  tdrURL,
  prPeriod,
  currentStory,
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

  const matrixHeaders = activityData.slice(0, 1)[0];

  //trims the data by filter option, used instead of raw data
  const trimmedData = trimData(activityData, prPeriod, currentStory);
  const trimmedWpData = wpData.filter((wp) => [...new Set(trimmedData.map((act) => act.WP))].includes(wp.id.slice(2)));
  const stakeholderData = await parseTDRMatrix(tdrURL, trimmedData);

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

  const stakeholderNodes = makeCyStakeholerNodes(stakeholderData);

  const stakeholderEdges = makeStakeholderCyEdges(stakeholderData);

  //node to hold all other nodes, prevents stakeholder nodes entering center of graph
  const projectNode = {
    group: "nodes",
    grabbable: false,
    data: {
      id: "project",
      type: "project",
    },
  };

  const cyElms = [nodes, stakeholderNodes, edges.flat(), stakeholderEdges.flat(), wpNodes, projectNode].flat();

  return {
    cyElms: cyElms,
    wpData: trimmedWpData,
    gantChartItems: gantChartItems,
    activityData: trimmedData,
    dates: convertedDates,
    stakeholderData: stakeholderData,
    matrixHeaders: matrixHeaders,
  };
}

export default makeVisElements;
