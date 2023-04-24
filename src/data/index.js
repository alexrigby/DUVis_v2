export const projectMeta = {
  NAME: "ALEXS TEST PROJECT",

  // ENDD: false,
  // STARTD: false,
  ENDD: new Date().toISOString().split("T")[0],
  STARTD: "2016-09-01",
};

export const actFields = {
  ID: "actividad",
  NAME: "activity name",
  WP: "WP",
  // STARTM: false,
  // ENDM: false,
  STARTM: "Start Month",
  ENDM: "End Month",

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
      -dont generate engagementScoreRef for each pr period

*/

export const STORIES = [
  { name: "Hydropower Energy Recovery", ids: [1, 2, 3, 4, 5, 6, 7, 8, 25, 27, 31, 42, 51, 52, 53, 54, 55, 80] },
  { name: "Drain Water Heat Recovery", ids: [9, 10, 11, 12, 14, 15, 16, 43, 50] },
  { name: "Water-Energy Efficiency Audit", ids: [36, 37, 38, 39, 40, 41, 56, 57, 58, 59] },
];
