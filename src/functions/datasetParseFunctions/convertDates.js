// converts to JS readable date format
export function convertDates(actData, months) {
  const endDates = actData.map((actD) => {
    //if the end or start month is undefined or ongoing then return that
    if (actD["End Month/ Ongoing"] === "Ongoing") {
      return "onGoing";
    } else if (actD["End Month/ Ongoing"] === "") {
      return "undefined";
      //else return the date coresponding to the month number (from the date file)
    } else {
      var endMonth = months.filter(function (d) {
        return d.month === actD["End Month/ Ongoing"];
      });
      return convertDate(endMonth[0].date, "end");
    }
  });

  const startDates = actData.map((actD) => {
    if (actD["Start Month"] === "") {
      return "undefined";
    } else {
      var startMonth = months.filter(function (d) {
        return d.month === actD["Start Month"];
      });
      return convertDate(startMonth[0].date, "start");
    }
  });

  return { startDates, endDates };
}

function convertDate(date, se) {
  //converts from Jan-22 format to jan 01 2022 format
  const y = "20" + date.split("-")[1];
  const m = getMonthFromString(date);
  const ld = getLastDayOfMonth(y, m);
  if (se === "start") {
    return y + "-" + m + "-01";
  } else {
    return y + "-" + m + "-" + ld;
  }
}

function getMonthFromString(mon) {
  return new Date(Date.parse(mon + " 1")).getMonth() + 1;
}

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

export default convertDates;
