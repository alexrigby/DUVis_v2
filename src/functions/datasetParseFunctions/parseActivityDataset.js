import giveActivityPrPeriod from "../datesFunction/giveActivtyPrPeriod";

export function parseActivityDataset(actData, dates, wpData, config) {
  //------------CONFIG-----------------
  const actFields = config.actFields;
  const projectConfig = config;

  //finds what color gned and assignes it to activities
  const getColorRef = (wp, color) => wpData.filter((record) => record.id === wp)[0][color];

  const activityData = actData.map((act, i) => {
    if (config.INCLUDE_DATES) {
      return {
        ...act,
        bgColor: getColorRef(`WP_${act[actFields.WP].trim()}`, "bgColor"),
        borderColor: getColorRef(`WP_${act[actFields.WP].trim()}`, "borderColor"),
        startDate: dateIsValid(new Date(act[actFields.START_DATE].trim()))
          ? act[actFields.START_DATE]
          : projectConfig.START_DATE,
        endDate: dateIsValid(new Date(act[actFields.END_DATE].trim()))
          ? act[actFields.END_DATE]
          : projectConfig.END_DATE,
        startPrPeriod: giveActivityPrPeriod(act, dates, "start", actFields),
        endPrPeriod: giveActivityPrPeriod(act, dates, "end", actFields),
        ...(act[actFields.SDGs] && { SDGs: [...new Set(act[actFields.SDGs].trim().split(","))] }), // split comma seperated list of SDGs into unique array of sdgs if provided
      };
    } else {
      return {
        ...act,
        bgColor: getColorRef(`WP_${act[actFields.WP.trim()]}`, "bgColor"),
        borderColor: getColorRef(`WP_${act[actFields.WP.trim()]}`, "borderColor"),
        ...(act[actFields.SDGs] && { SDGs: [...new Set(act[actFields.SDGs].trim().split(","))] }), // split comma seperated list of SDGs into unique array of sdgs if provided
      };
    }
  });

  function dateIsValid(date) {
    //Check if the date is an instance of the Date object.
    //Check if passing the date to the isNaN() function returns false.
    return date instanceof Date && !isNaN(date);
  }

  // // ------ USE TO ANNONYMISE THE TOOL ____________________
  // const researchers = [...new Set(activityData.map((act) => act.Name))];

  // const researcherID = researchers.map((r, i) => {
  //   return { name: r, ID: `Researcher ${i + 1}` };
  // });

  // const annonomusActData = activityData.map((act) => {
  //   const ID = researcherID.find((el) => el.name === act.Name);

  //   return { ...act, Name: ID.ID };
  // });

  // console.log(annonomusActData);

  // return annonomusActData;
  return activityData;
}

export default parseActivityDataset;
