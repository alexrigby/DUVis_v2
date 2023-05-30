export function giveActivityPrPeriod(act, dates, se, actFields) {
  const startOrEnd = se === "start" ? actFields.START_DATE : actFields.END_DATE;
  const startOrEndPR = se === "start" ? dates[0].prPeriod : dates[dates.length - 1].prPeriod;

  if (!dateIsValid(new Date(act[startOrEnd]))) {
    return act[startOrEndPR];
  } else {
    return dates.filter((d) => d.date.slice(0, 7) === act[startOrEnd].slice(0, 7))[0].prPeriod;
  }
}

export default giveActivityPrPeriod;

function dateIsValid(date) {
  //Check if the date is an instance of the Date object.
  //Check if passing the date to the isNaN() function returns false.
  return date instanceof Date && !isNaN(date);
}
