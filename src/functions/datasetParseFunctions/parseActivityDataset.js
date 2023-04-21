import convertMonthsToDates from "../datesFunction/convertMonthsToDates";
import giveActivityPrPeriod from "../datesFunction/giveActivtyPrPeriod";
import { actFields } from "../../data";

export function parseActivityDataset(data, dates) {
  const activityData = data.map((act, i) => {
    return {
      ...act,
      startDate: convertMonthsToDates(act, dates, "start"),
      endDate: convertMonthsToDates(act, dates, "end"),
      startPrPeriod: giveActivityPrPeriod(act, dates, "start"),
      endPrPeriod: giveActivityPrPeriod(act, dates, "end"),
    };
  });

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
