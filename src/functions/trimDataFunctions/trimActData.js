export function trimActData(actData, prPeriod, currentStory, configRef) {
  const actFields = configRef.current.actFields;
  const filterByStory = currentStory !== null && prPeriod.pr === null;
  const filterByPr = currentStory === null && prPeriod.pr !== null;
  const filterByBoth = currentStory !== null && prPeriod.pr !== null;

  const filterByPrPeriod = (act) => act.startPrPeriod <= prPeriod.pr;
  let filteredData = actData; //truly filtered data to use for nodes and gantt chart
  let filteredByPr = actData; // only filrtered by pr to be able to get max engagement level

  if (!filterByStory && !filterByPr && !filterByBoth) {
    filteredData = actData;
    filteredByPr = actData;
  } else if (filterByStory) {
    filteredData = filterStoryData(filteredData, currentStory.ids, actFields);
    filteredByPr = actData;
  } else if (filterByPr) {
    filteredData = filteredData.filter(filterByPrPeriod);
    filteredByPr = filteredData.filter(filterByPrPeriod);
  } else if (filterByBoth) {
    filteredByPr = filteredData.filter(filterByPrPeriod);
    //first filter by story
    filteredData = filterStoryData(filteredData, currentStory.ids, actFields);
    //then filter that story data by prperiod
    filteredData = filteredData.filter(filterByPrPeriod);
  }

  return { trimmedActData: filteredData, filteredByPr };
}
export default trimActData;

// d = dataset, s = array of story activity ids
export function filterStoryData(d, s, actFields) {
  let sd = [];
  for (let i = 0; i < s.length; i++) {
    sd.push(d.filter((record) => record[actFields.ID] === s[i]));
  }
  return sd.flat();
}
