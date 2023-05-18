import { error } from "vega";
import * as XLSX from "xlsx";
export function getDataset(excelDataset, config) {
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

  var stWorksheetMissing = [];
  // Removes stakeholders if the stakeholder worksheet is misspelt or has no values
  if (stLinks.length === 0) {
    config.INCLUDE_STHOLDERS = false;
    //if value is not null then return the string to display as an error
    config.WORKSHEETS.STAKEHOLDER_LINKS && stWorksheetMissing.push(config.WORKSHEETS.STAKEHOLDER_LINKS);
  }

  if (stDataset.length === 0) {
    config.INCLUDE_STHOLDERS = false;
    config.WORKSHEETS.STAKEHOLDER_LINKS && stWorksheetMissing.push(config.WORKSHEETS.STAKEHOLDERS);
  }

  var errors = [];
  //error messages if workseets not found --- block updating of local storage
  if (actDataset.length === 0) {
    errors.push(config.WORKSHEETS.ACTIVITIES);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.ACTIVITIES}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  if (wpDataset.length === 0) {
    errors.push(config.WORKSHEETS.WORKPACKAGES);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.WORKPACKAGES}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  if (actLinks.length === 0) {
    errors.push(config.WORKSHEETS.ACTIVITY_LINKS);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.ACTIVITY_LINKS}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  const fatalErrors = errors.length > 0 ? errors : null;

  return { actLinks, stLinks, actDataset, wpDataset, stDataset, stWorksheetMissing, fatalErrors };
}

export default getDataset;
