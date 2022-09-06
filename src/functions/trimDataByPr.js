export function trimDataByPr(actData, pr) {
  if (pr.undefined === true) {
    return actData.filter((act) => act.startPrPeriod <= pr.pr || act.startPrPeriod === "undefined");
  } else {
    return actData.filter((act) => act.startPrPeriod <= pr.pr);
  }
}

export default trimDataByPr;
