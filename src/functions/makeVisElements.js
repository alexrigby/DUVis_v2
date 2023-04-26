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
import { projectMeta, INCLUDE_DATES } from "../data";

export async function makeVisElements(prPeriod, currentStory, completedDisplay) {
  /* IF DATES ARE NOT INCLUDED:
        -dont generate gantt chart items
        -dont convert months to dates for act nodes
   */
  // ------------------------ FETCH CSV DATA -------------------------
  const file = await (await fetch(workBookPath)).arrayBuffer();
  const workBookData = XLSX.read(file); // reads the whole workbook
  // header: 1 returns array of arrays of csv rows, use for crosstab datasets
  const actLinks = XLSX.utils.sheet_to_json(workBookData.Sheets["links"], { header: 1, defval: "", raw: false }); // TO DO raw false = doesnt convert types (e.g. 1 === "1") need to change as I continue
  const stLinks = XLSX.utils.sheet_to_json(workBookData.Sheets["stakeholder links"], {
    header: 1,
    defval: "",
    raw: false,
  });
  // convert the csvs to JSON format
  const actDataset = XLSX.utils.sheet_to_json(workBookData.Sheets["Activities"], { defval: "", raw: false });
  const wpDataset = XLSX.utils.sheet_to_json(workBookData.Sheets["work packages"], { defval: "", raw: false });
  const stDataset = XLSX.utils.sheet_to_json(workBookData.Sheets["stakeholder list"], { defval: "", raw: false });
  projectMeta.STHOLDERS = stDataset.length === 0 ? false : true; // check if

  //-----------------MAKE DATES AND MONTHS ARRAY-----//
  const startDate = projectMeta.STARTD;
  const todaysDate = projectMeta.ENDD;
  const dates = INCLUDE_DATES && makeDates(startDate, todaysDate);

  //-----------------PARSE DATA ----------
  // if no months are provided then dont add dates to data
  const wpData = parseWPDataset(wpDataset);
  const activityData = parseActivityDataset(actDataset, dates, wpData);
  const links = linksMatrixToArray(actLinks);

  //-------------TRIM ACT DATA TO FILTER SPECIFICATION ----------------
  const latestPrPeriod = INCLUDE_DATES && dates[dates.length - 1].prPeriod;
  //trimmedActData === current filter, filteredByPr === all data in curent pr period regardless of story filter
  const { trimmedActData, filteredByPr } = trimActData(activityData, prPeriod, currentStory);

  //only return wps that are present in actdataset
  const trimmedWpData = wpData.filter((wp) =>
    [...new Set(trimmedActData.map((act) => `WP_${act.WP}`))].includes(wp.id)
  );

  // ----TRIM & FILTER STAKEHOLDERS-------
  // returns the max engagement score for the pr period (regardless of stroy filter)
  const maxEngScore = projectMeta.STHOLDERS && parseStakeholderDataset(stLinks, stDataset, filteredByPr).maxEngScore;
  // creates ealily readable stakeholder object from stData and stLinks to match trimmed activity data
  const stakeholderData =
    projectMeta.STHOLDERS && parseStakeholderDataset(stLinks, stDataset, trimmedActData).stakeholderData;

  //----MAKE VIS ELEMENTS -------------
  const actNodes = makeActNodes(trimmedActData);
  const actEdges = makeActEdges(links, actNodes);
  const wpNodes = makeWpNodes(trimmedWpData);
  const wpEdges = makeWpEdges(trimmedWpData);
  const stakeholderNodes = projectMeta.STHOLDERS && makeStakeholerNodes(stakeholderData);
  const stakeholderEdges = projectMeta.STHOLDERS && makeStakeholderEdges(stakeholderData);

  const gantChartItems =
    INCLUDE_DATES &&
    makeGantchartItems(trimmedActData, trimmedWpData, prPeriod, completedDisplay, latestPrPeriod, dates);

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
  const cyElms = [...actNodes, ...actEdges.flat(), ...wpNodes, ...wpEdges].flat();
  //if stakeholders are included then add them to cy elements
  projectMeta.STHOLDERS && cyElms.push(...stakeholderNodes, ...stakeholderEdges.flat(), projectNode);

  return {
    cyElms,
    gantChartItems,
    activityData,
    dates,
    stakeholderData,
    latestPrPeriod,
    maxEngScore,
  };
}

export default makeVisElements;
