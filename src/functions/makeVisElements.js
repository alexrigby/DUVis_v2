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

export async function makeVisElements(prPeriod, currentStory, completedDisplay, config, excelDataset) {
  // ------------------------ FETCH CSV DATA -------------------------
  const workBookData = XLSX.read(excelDataset);

  // header: 1 returns array of arrays of csv rows, use for crosstab datasets
  const actLinks = XLSX.utils.sheet_to_json(workBookData.Sheets[config.WORKSHEETS.ACTIVITY_LINKS], {
    header: 1,
    defval: "",
    raw: false,
  }); // TO DO raw false = doesnt convert types (e.g. 1 === "1") need to change as I continue

  const stLinks = XLSX.utils.sheet_to_json(workBookData.Sheets[config.WORKSHEETS.STAKEHOLDER_LINKS], {
    header: 1,
    defval: "",
    raw: false,
  });

  // convert the csvs to JSON format
  const actDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[config.WORKSHEETS.ACTIVITIES], {
    defval: "",
    raw: false,
  });

  const wpDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[config.WORKSHEETS.WORKPACKAGES], {
    defval: "",
    raw: false,
  });
  const stDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[config.WORKSHEETS.STAKEHOLDERS], {
    defval: "",
    raw: false,
  });

  function getMissingFields(dataset, config) {
    const datasetHeaders = Object.keys(dataset[0]);
    const { META_FIELDS, CATEGORYS_PROVIDED, ...rest } = config;
    const configHeaders = [...Object.values(rest), ...META_FIELDS.map((f) => f.name)];

    // if the field is not specified as null then return litst of missing header fields
    const missingFields = configHeaders.filter((h) => h && !datasetHeaders.includes(h));
    return missingFields;
  }

  const missingWpFields = getMissingFields(wpDataset, config.wpFields);
  const missingActFields = getMissingFields(actDataset, config.actFields);
  const missingStFields = getMissingFields(stDataset, config.stFields);

  const missingFieldWarning = {
    wpFields: missingWpFields,
    actFields: missingActFields,
    stFields: missingStFields,
  };

  //-----------------MAKE DATES AND MONTHS ARRAY-----//
  const startDate = config.START_DATE;
  const endDate = config.END_DATE;
  const dates = config.INCLUDE_DATES && makeDates(startDate, endDate, config);

  //-----------------PARSE DATA ----------
  // if no months are provided then dont add dates to data
  const wpData = parseWPDataset(wpDataset);
  const activityData = parseActivityDataset(actDataset, dates, wpData, config);

  const links = linksMatrixToArray(actLinks);

  //-------------TRIM ACT DATA TO FILTER SPECIFICATION ----------------
  const latestPrPeriod = config.INCLUDE_DATES && dates[dates.length - 1].prPeriod;
  //trimmedActData === current filter, filteredByPr === all data in curent pr period regardless of story filter
  const { trimmedActData, filteredByPr } = trimActData(activityData, prPeriod, currentStory, config);

  //only return wps that are present in actdataset
  const trimmedWpData = wpData.filter((wp) =>
    [...new Set(trimmedActData.map((act) => `WP_${act.WP}`))].includes(wp.id)
  );

  // ----TRIM & FILTER STAKEHOLDERS-------
  // returns the max engagement score for the pr period (regardless of stroy filter)
  const maxEngScore =
    config.INCLUDE_STHOLDERS && parseStakeholderDataset(stLinks, stDataset, filteredByPr, config).maxEngScore;
  // creates ealily readable stakeholder object from stData and stLinks to match trimmed activity data
  const stakeholderData =
    config.INCLUDE_STHOLDERS && parseStakeholderDataset(stLinks, stDataset, trimmedActData, config).stakeholderData;

  //----MAKE VIS ELEMENTS -------------
  const actNodes = makeActNodes(trimmedActData, config);
  const actEdges = makeActEdges(links, actNodes);
  const wpNodes = makeWpNodes(trimmedWpData, config);
  const wpEdges = makeWpEdges(trimmedWpData, config);
  const stakeholderNodes = config.INCLUDE_STHOLDERS && makeStakeholerNodes(stakeholderData);
  const stakeholderEdges = config.INCLUDE_STHOLDERS && makeStakeholderEdges(stakeholderData);

  const gantChartItems =
    config.INCLUDE_DATES &&
    makeGantchartItems(trimmedActData, trimmedWpData, prPeriod, completedDisplay, latestPrPeriod, config);

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
  config.INCLUDE_STHOLDERS && cyElms.push(...stakeholderNodes, ...stakeholderEdges.flat(), projectNode);

  return {
    cyElms,
    gantChartItems,
    activityData: trimmedActData,
    dates,
    stakeholderData,
    latestPrPeriod,
    maxEngScore,
    missingFieldWarning,
  };
}

export default makeVisElements;
