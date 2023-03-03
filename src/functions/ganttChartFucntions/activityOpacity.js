import statusOpacity from "../../configs/statusOpacity";

export function activityOpacity(act, latestPrPeriod, prPeriod) {
  const undefOrOngoing = act.endPrPeriod === "undefined" || act.endPrPeriod === "onGoing" || act.endPrPeriod === "";
  const beforeLatestPr = act.endPrPeriod < latestPrPeriod ? statusOpacity.completed : statusOpacity.onGoing;
  const beforeSelectedPr = act.endPrPeriod < prPeriod.pr ? statusOpacity.completed : statusOpacity.onGoing;

  if (undefOrOngoing) {
    //no matter what undef or ongoing acts will be styled as ongoing
    return statusOpacity.onGoing;
  } else if (prPeriod.pr === null) {
    return beforeLatestPr;
  } else {
    return beforeSelectedPr;
  }
}

export default activityOpacity;
