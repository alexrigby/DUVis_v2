import * as XLSX from "xlsx";
import cloneDeep from "lodash.clonedeep";
export function getDataset(excelDataset, config, setConfig) {
  const configCopy = cloneDeep(config);

  // ------------------------ FETCH CSV DATA -------------------------
  const workBookData = XLSX.read(excelDataset);

  // header: 1 returns array of arrays of csv rows, use for crosstab datasets
  const actLinks = XLSX.utils.sheet_to_json(workBookData.Sheets[configCopy.WORKSHEETS.ACTIVITY_LINKS], {
    header: 1,
    defval: "",
    raw: false,
  }); // TO DO raw false = doesnt convert types (e.g. 1 === "1") need to change as I continue

  const stLinks = XLSX.utils.sheet_to_json(workBookData.Sheets[configCopy.WORKSHEETS.STAKEHOLDER_LINKS], {
    header: 1,
    defval: "",
    raw: false,
  });

  // convert the csvs to JSON format
  const actDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[configCopy.WORKSHEETS.ACTIVITIES], {
    defval: "",
    raw: false,
  });

  const wpDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[configCopy.WORKSHEETS.WORKPACKAGES], {
    defval: "",
    raw: false,
  });
  const stDataset = XLSX.utils.sheet_to_json(workBookData.Sheets[configCopy.WORKSHEETS.STAKEHOLDERS], {
    defval: "",
    raw: false,
  });

  //-----------------DEAL WITH MISSING STAKEHOLDER WORKSHEETS--------------------------------
  var stWorksheetMissing = [];
  // Removes stakeholders if the stakeholder worksheet is misspelt or has no values
  if (stLinks.length === 0) {
    //if value is not null then return the string to display as an error
    configCopy.WORKSHEETS.STAKEHOLDER_LINKS && stWorksheetMissing.push(configCopy.WORKSHEETS.STAKEHOLDER_LINKS);
    //set stakeholders included to false in config state
    setConfig((prevState) => (prevState.INCLUDE_STHOLDERS ? { ...prevState, INCLUDE_STHOLDERS: false } : prevState));
  }

  if (stDataset.length === 0) {
    configCopy.WORKSHEETS.STAKEHOLDER_LINKS && stWorksheetMissing.push(configCopy.WORKSHEETS.STAKEHOLDERS);

    setConfig((prevState) => (prevState.INCLUDE_STHOLDERS ? { ...prevState, INCLUDE_STHOLDERS: false } : prevState));
  }

  var fatalErrors = [];
  //error messages if workseets not found --- block updating of local storage
  if (actDataset.length === 0) {
    fatalErrors.push(configCopy.WORKSHEETS.ACTIVITIES);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.ACTIVITIES}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  if (wpDataset.length === 0) {
    fatalErrors.push(configCopy.WORKSHEETS.WORKPACKAGES);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.WORKPACKAGES}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  if (actLinks.length === 0) {
    fatalErrors.push(configCopy.WORKSHEETS.ACTIVITY_LINKS);
    // alert(`ERROR!! Cound not find the "${config.WORKSHEETS.ACTIVITY_LINKS}" worksheet,
    // make sure that the config and dataset spellings match`);
    // localStorage.removeItem("excelDataset");
  }

  console.log(fatalErrors);

  return { visData: { actLinks, stLinks, actDataset, wpDataset, stDataset, stWorksheetMissing }, fatalErrors };
}

export default getDataset;
