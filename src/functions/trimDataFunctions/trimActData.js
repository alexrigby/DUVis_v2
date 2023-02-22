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
    sd.push(d.filter((record) => record.ID == s[i]));
  }
  return sd.flat();
}

// export function trimActData(actData, prPeriod, currentStory) {
//   //if no filter then return whole dataset
//   if (currentStory === null && prPeriod.pr === null) {
//     return actData;
//     //if story is selected but no pr return whole story
//   } else if (currentStory !== null && prPeriod.pr === null) {
//     return filterStoryData(actData, currentStory.ids);
//   }
//   //if no story is selected but a pr is selected then return progress report
//   else if (currentStory === null && prPeriod.pr !== null) {
//     if (prPeriod.undefined === true) {
//       return actData.filter((act) => act.startPrPeriod <= prPeriod.pr || act.startPrPeriod === "undefined");
//     } else {
//       return actData.filter((act) => act.startPrPeriod <= prPeriod.pr);
//     }
//     //if story and progress report are seleted return both
//   } else {
//     let story = filterStoryData(actData, currentStory.ids);
//     if (prPeriod.undefined === true) {
//       return story.filter((act) => act.startPrPeriod <= prPeriod.pr || act.startPrPeriod === "undefined");
//     } else {
//       return story.filter((act) => act.startPrPeriod <= prPeriod.pr);
//     }
//   }
// }
