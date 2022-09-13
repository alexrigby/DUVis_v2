export function trimData(actData, prPeriod, storyIds) {
  if (storyIds === null && prPeriod.pr === null) {
    return actData;
  }
  //if no stroy is selected trm full dataset
  else if (storyIds === null) {
    if (prPeriod.undefined === true) {
      return actData.filter((act) => act.startPrPeriod <= prPeriod.pr || act.startPrPeriod === "undefined");
    } else {
      return actData.filter((act) => act.startPrPeriod <= prPeriod.pr);
    }
    //if story is selected then flter the ids of the story
  } else {
    let story = filterStoryData(actData, storyIds);
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
