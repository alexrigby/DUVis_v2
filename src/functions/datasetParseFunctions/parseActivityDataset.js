import giveActivityPrPeriod from "../datesFunction/giveActivtyPrPeriod";
import { actFields, projectMeta } from "../../data";
import { INCLUDE_DATES } from "../../data";

export function parseActivityDataset(data, dates, wpData) {
  //finds what color gned and assignes it to activities
  const getColorRef = (wp, color) => wpData.filter((record) => record.id === wp)[0][color];
  const activityData = data.map((act, i) => {
    if (INCLUDE_DATES) {
      return {
        bgColor: getColorRef(`WP_${act[actFields.WP]}`, "bgColor"),
        borderColor: getColorRef(`WP_${act[actFields.WP]}`, "borderColor"),
        startDate: dateIsValid(new Date(act[actFields.START_DATE])) ? act[actFields.START_DATE] : projectMeta.STARTD,
        endDate: dateIsValid(new Date(act[actFields.END_DATE])) ? act[actFields.END_DATE] : projectMeta.ENDD,
        startPrPeriod: giveActivityPrPeriod(act, dates, "start"),
        endPrPeriod: giveActivityPrPeriod(act, dates, "end"),
        ...act,
      };
    } else {
      return {
        ...act,
        bgColor: getColorRef(`WP_${act[actFields.WP]}`, "bgColor"),
        borderColor: getColorRef(`WP_${act[actFields.WP]}`, "borderColor"),
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
