export const projectMeta = {
  NAME: "ALEXS TEST PROJECT",
  STARTD: "2016-09-01",
  ENDD: new Date().toISOString().split("T")[0],
};

export const actFields = {
  ID: "actividad",
  NAME: "activity name",
  WP: "WP",
  STARTM: false,
  ENDM: false,

  META_FIELDS: ["category", "Activity description"],
};

export const wpFields = {
  ID: "id",
  NAME: "wp name",
  // SDGs: "SDGs",

  META_FIELDS: ["category", "location test"],
};

export const stFields = {
  ID: "S_ID",
  NAME: "stakeholder name",

  META_FIELDS: ["Sector", "Category test"],
};

export const INCLUDE_DATES = !actFields.STARTM || !actFields.ENDM ? false : true;
//----------------------ARE DATES SUPPLIED BY USER? ----------------------//
/*
    if no dates provided:
      -Dont Generate Gannt Chart
      -Dont Generate anylitis time series
      -Dont generate filter by pr period
      -dont generate date/month text in meta pannel
*/
