export function trimData(actData, prPeriod, storyIds) {
  //if no filter then return whole dataset
  if (storyIds === null && prPeriod.pr === null) {
    return actData;
    //if story is selected but no pr return whole story
  } else if (storyIds !== null && prPeriod.pr === null) {
    return filterStoryData(actData, storyIds.ids);
  }
  //if no story is selected but a pr is selected then return progress report
  else if (storyIds === null && prPeriod.pr !== null) {
    if (prPeriod.undefined === true) {
      return actData.filter((act) => act.startPrPeriod <= prPeriod.pr || act.startPrPeriod === "undefined");
    } else {
      return actData.filter((act) => act.startPrPeriod <= prPeriod.pr);
    }
    //if story and progress report are seleted return both
  } else {
    let story = filterStoryData(actData, storyIds.ids);
    if (prPeriod.undefined === true) {
      return story.filter((act) => act.startPrPeriod <= prPeriod.pr || act.startPrPeriod === "undefined");
    } else {
      return story.filter((act) => act.startPrPeriod <= prPeriod.pr);
    }
  }
}

export default trimData;

// d = dataset, s = array of story activity ids
export function filterStoryData(d, s) {
  let sd = [];
  for (let i = 0; i < s.length; i++) {
    sd.push(d.filter((record) => record.ID == s[i]));
  }
  return sd.flat();
}
