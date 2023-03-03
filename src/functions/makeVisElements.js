import parseActivityDataset from "./datasetParseFunctions/parseActivityDataset";
import parseLinks from "./datasetParseFunctions/parseLinks";
import makeActEdges from "./cyElements/makeActEdges";
import makeActNodes from "./cyElements/makeActNodes";
import makeGantchartItems from "./ganttChartFucntions/makeGantchartItems";
import makeWpNodes from "./cyElements/makeWpNodes";
import trimActData from "./trimDataFunctions/trimActData";
import parseStakeholderDataset from "./datasetParseFunctions/parseStakeholderDataset";
import makeStakeholerNodes from "./cyElements/makeStakeholderNodes";
import makeStakeholderEdges from "./cyElements/makeStakeholderEdges";
import makeWpEdges from "./cyElements/makeWpEdges";
import makeDates from "./datesFunction/makeDates";
import parseWPDataset from "./datasetParseFunctions/parseWPDataset";

import actDataset from "../data/activity_matrix.txt";
import actLinks from "../data/links.txt";
import wpDataset from "../data/wp_names.txt";
import tdrDataset from "../data/stakeholder_matrix.txt";

export async function makeVisElements(prPeriod, currentStory, completedDisplay) {
  //-----------------MAKE DATES AND MONTHS ARRAY-----//
  const startDate = "2016-09-01";
  const todaysDate = new Date().toISOString().split("T")[0];
  const dates = makeDates(startDate, todaysDate);

  //-----------------FETCH AND PARSE DATA ----------
  const activityData = await parseActivityDataset(actDataset, dates);
  const links = await parseLinks(actLinks);
  const wpData = await parseWPDataset(wpDataset);

  //-------------TRIM DATA TO FILTER SPECIFICATION ----------------
  const latestPrPeriod = dates[dates.length - 1].prPeriod;
  const trimmedActData = trimActData(activityData, prPeriod, currentStory);
  const trimmedWpData = wpData.filter((wp) =>
    [...new Set(trimmedActData.map((act) => act.WP))].includes(wp.id.slice(2))
  );

  // ----TRIM & FILTER STAKEHOLDERS-------
  const stakeholderData = await parseStakeholderDataset(tdrDataset, trimmedActData);

  //----MAKE VIS ELEMENTS -------------
  const actNodes = makeActNodes(trimmedActData);
  const actEdges = makeActEdges(links, actNodes);
  const wpNodes = makeWpNodes(trimmedWpData);
  const wpEdges = makeWpEdges(trimmedWpData);
  const stakeholderNodes = makeStakeholerNodes(stakeholderData);
  const stakeholderEdges = makeStakeholderEdges(stakeholderData);
  const gantChartItems = makeGantchartItems(
    trimmedActData,
    trimmedWpData,
    prPeriod,
    completedDisplay,
    latestPrPeriod,
    dates
  );

  //node to hold all other nodes, prevents stakeholder nodes entering center of graph
  const projectNode = {
    group: "nodes",
    grabbable: false,
    data: {
      parent: "t",
      id: "project",
      type: "project",
      label: "",
    },
  };

  //----ALL CYTOSCAPE ELEMENTS-----
  const cyElms = [
    actNodes,
    stakeholderNodes,
    actEdges.flat(),
    stakeholderEdges.flat(),
    wpNodes,
    projectNode,
    wpEdges,
  ].flat();

  return {
    cyElms,
    gantChartItems,
    activityData,
    dates,
    stakeholderData,
    latestPrPeriod,
  };
}

export default makeVisElements;
