import statusOpacity from "../../configs/statusOpacity";

export function activityOpacity(act, latestPrPeriod, prPeriod) {
  if (prPeriod.pr === null) {
    if (act.endPrPeriod === "undefined" || act.endPrPeriod === "onGoing") {
      //if ongoing or undefined then give full opacity (treat undefined as ongoing for now)
      return statusOpacity.onGoing;
    } else {
      //if prPeriod is null then work from the latest pr period
      return act.endPrPeriod < latestPrPeriod ? statusOpacity.completed : statusOpacity.onGoing;
    }
    //if prperiod is defined then work of the pr period
  } else if (act.endPrPeriod === "undefined" || act.endPrPeriod === "onGoing") {
    return statusOpacity.onGoing;
  } else {
    return act.endPrPeriod < prPeriod.pr ? statusOpacity.completed : statusOpacity.onGoing;
  }
}

export default activityOpacity;
