import * as XLSX from "xlsx";

import parseActivityDataset from "./datasetParseFunctions/parseActivityDataset";

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
import linksMatrixToArray from "./datasetParseFunctions/linksMatrixToArray";

import workBookPath from "../data/activity_data.xlsx";

export async function makeVisElements(prPeriod, currentStory, completedDisplay) {
  // ------------------------ FETCH CSV DATA -------------------------
  const file = await (await fetch(workBookPath)).arrayBuffer();
  const workBookData = XLSX.read(file); // reads the whole workbook
  // header: 1 returns array of arrays of csv rows, use for crosstab datasets
  const actLinks = XLSX.utils.sheet_to_json(workBookData.Sheets["links"], { header: 1, defval: "", raw: false }); // TO DO raw false = doesnt convert types (e.g. 1 === "1") need to change as I continue
  const tdr = XLSX.utils.sheet_to_json(workBookData.Sheets["stakeholders"], { header: 1, defval: "", raw: false });
  // convert the csvs to JSON format
  const actDataset = XLSX.utils.sheet_to_json(workBookData.Sheets["Activities"], { defval: "", raw: false });
  const wpDataset = XLSX.utils.sheet_to_json(workBookData.Sheets["work packages"], { defval: "", raw: false });

  // const stakeholderTest = XLSX.utils.sheet_to_json(workBookData.Sheets["stakeholders"], { defval: "", raw: false });

  //-----------------MAKE DATES AND MONTHS ARRAY-----//
  const startDate = "2016-09-01";
  const todaysDate = new Date().toISOString().split("T")[0];
  const dates = makeDates(startDate, todaysDate);

  //-----------------PARSE DATA ----------
  const activityData = parseActivityDataset(actDataset, dates);
  const links = linksMatrixToArray(actLinks);
  const wpData = parseWPDataset(wpDataset);

  //-------------TRIM DATA TO FILTER SPECIFICATION ----------------
  const latestPrPeriod = dates[dates.length - 1].prPeriod;
  const trimmedActData = trimActData(activityData, prPeriod, currentStory);
  const trimmedWpData = wpData.filter((wp) =>
    [...new Set(trimmedActData.map((act) => `WP_${act.WP}`))].includes(wp.id)
  );

  // ----TRIM & FILTER STAKEHOLDERS-------
  const stakeholderData = parseStakeholderDataset(tdr, trimmedActData);

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
