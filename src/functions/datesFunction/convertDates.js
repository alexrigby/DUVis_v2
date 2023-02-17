//REDUNDANT!!!!!!

export function convertDates(date, se) {
  //converts from Jan-22 format to jan/01/2022 format
  const browserDate = date.replace(/-/g, "/"); // "/" works beterr than "-" for multiple browsers
  const y = "20" + browserDate.split("/")[1];
  const m = getMonthFromString(browserDate);
  const ld = getLastDayOfMonth(y, m);

  if (se === "start" || se === null) {
    console.log(y + "-" + m + "-01");
    return y + "-" + m + "-01";
  } else if (se === "end") {
    return y + "-" + m + "-" + ld;
  }
}

function getMonthFromString(mon) {
  return new Date(Date.parse(mon + "/1")).getMonth() + 1;
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export default convertDates;
