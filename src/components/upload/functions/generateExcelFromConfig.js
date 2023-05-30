import * as XLSX from "xlsx";
import cloneDeep from "lodash.clonedeep";

export function generateExcelFromConfig(config) {
  const configClone = cloneDeep(config);
  const includeStakeholders =
    configClone.stFields && configClone.WORKSHEETS.STAKEHOLDERS && configClone.WORKSHEETS.STAKEHOLDER_LINKS;
  //----------------get headers----------------------------------
  const actFields = getConfigValues(configClone.actFields);
  const wpFields = getConfigValues(configClone.wpFields);
  const stFields = includeStakeholders && getConfigValues(configClone.stFields);

  //----------------------add headers to sheets-----------------------------------
  const actWorksheet = XLSX.utils.aoa_to_sheet([actFields]);
  const wpWorksheet = XLSX.utils.aoa_to_sheet([wpFields]);
  const stWorksheet = XLSX.utils.aoa_to_sheet([stFields]);
  const actLinkWorksheet = XLSX.utils.aoa_to_sheet([[configClone.actFields.ID]]);
  const stLinkWorksheet =
    includeStakeholders && XLSX.utils.aoa_to_sheet([[`${configClone.stFields.ID}/${configClone.actFields.ID}`]]);
  //------------------add sheets to workbook-----------------------------------
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, actWorksheet, configClone.WORKSHEETS.ACTIVITIES);
  XLSX.utils.book_append_sheet(workbook, wpWorksheet, configClone.WORKSHEETS.WORKPACKAGES);
  XLSX.utils.book_append_sheet(workbook, actLinkWorksheet, configClone.WORKSHEETS.ACTIVITY_LINKS);

  if (includeStakeholders) {
    XLSX.utils.book_append_sheet(workbook, stWorksheet, configClone.WORKSHEETS.STAKEHOLDERS);
    XLSX.utils.book_append_sheet(workbook, stLinkWorksheet, configClone.WORKSHEETS.STAKEHOLDER_LINKS);
  }

  //---------------download workbook------------------------------
  XLSX.writeFile(workbook, `${configClone.NAME} ReActiVis dataset.xlsx`);
}

export default generateExcelFromConfig;

function getConfigValues(workSheet) {
  const { META_FIELDS, CATEGORYS_PROVIDED, ...noMetaField } = workSheet;
  const metaFieldValues = META_FIELDS.map((f) => f.name);
  const fieldValues = Object.values(noMetaField);

  return [...fieldValues, ...metaFieldValues].filter((record) => record); // filters null value and only returns truthy falues
}
