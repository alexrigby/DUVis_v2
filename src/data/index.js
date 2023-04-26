export const projectMeta = {
  NAME: "ALEX'S TEST PROJECT",
  // ENDD: false,
  // STARTD: false,
  ENDD: new Date().toISOString().split("T")[0],
  STARTD: "2016-09-01",
  PR_PERIOD: 6,
  STHOLDERS: true, //default true but changed if no stakeholder provided
};

export const actFields = {
  ID: "actividad",
  NAME: "activity name",
  WP: "WP",
  START_DATE: "start date",
  END_DATE: "end date",
  // STARTM: false,
  // ENDM: false,
  // STARTM: "Start Month",
  // ENDM: "End Month",

  META_FIELDS_f: ["category", "Activity description", "test"],
  META_FIELDS: [
    { name: "category", type: "categorical" },
    { name: "Activity description", type: "text" },
    { name: "test", type: "categorical" },
  ],
};

export const wpFields = {
  ID: "id",
  NAME: "wp name",
  // SDGs: "SDGs",

  META_FIELDS: [
    { name: "category", type: "categorical" },
    { name: "location test", type: "categorical" },
    { name: "test text", type: "text" },
  ],
};

export const stFields = {
  ID: "S_ID",
  NAME: "stakeholder name",

  META_FIELDS: [
    { name: "Sector", type: "categorical" },
    { name: "Category test", type: "categorical" },
    { name: "test text type", type: "text" },
  ],
};

export const INCLUDE_DATES = !actFields.START_DATE || !actFields.END_DATE ? false : true;
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
  { name: "test", ids: [1, 4, 5, 6, 75, 354] },
];
