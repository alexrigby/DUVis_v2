export function trimDataByPr(actData, pr) {
  //   console.log(pr);
  return actData.filter((act) => act.startPrPeriod <= pr);
}

export default trimDataByPr;
