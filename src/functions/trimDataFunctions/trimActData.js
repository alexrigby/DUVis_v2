import { actFields } from "../../data";

export function trimActData(actData, prPeriod, currentStory) {
  const filterByStory = currentStory !== null && prPeriod.pr === null;
  const filterByPr = currentStory === null && prPeriod.pr !== null;
  const filterByBoth = currentStory !== null && prPeriod.pr !== null;

  const filterByPrPeriod = (act) => act.startPrPeriod <= prPeriod.pr;
  let filteredData = actData;

  if (!filterByStory && !filterByPr && !filterByBoth) {
    filteredData = actData;
  } else if (filterByStory) {
    filteredData = filterStoryData(filteredData, currentStory.ids);
  } else if (filterByPr) {
    filteredData = filteredData.filter(filterByPrPeriod);
  } else if (filterByBoth) {
    //first filter by story
    filteredData = filterStoryData(filteredData, currentStory.ids);
    //then filter that story data by prperiod
    filteredData = filteredData.filter(filterByPrPeriod);
  }

  return filteredData;
}
export default trimActData;

// d = dataset, s = array of story activity ids
export function filterStoryData(d, s) {
  let sd = [];
  for (let i = 0; i < s.length; i++) {
    sd.push(d.filter((record) => record[actFields.ID] === s[i]));
  }
  return sd.flat();
}
