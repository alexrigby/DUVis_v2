import convertDates from "./convertDates";

// converts to JS readable date format
export function convertMonthsToDates(act, months, se) {
  if (se === "end") {
    //if the end or start month is undefined or ongoing then return that
    if (act["End Month/ Ongoing"] === "Ongoing") {
      return "onGoing";
    } else if (act["End Month/ Ongoing"] === "") {
      return "undefined";
      //else return the date coresponding to the month number (from the date file)
    } else {
      var endMonth = months.filter(function (d) {
        return d.month === act["End Month/ Ongoing"];
      });
      return convertDates(endMonth[0].date, se);
    }
  } else if (se === "start") {
    if (act["Start Month"] === "") {
      return "undefined";
    } else {
      var startMonth = months.filter(function (d) {
        return d.month === act["Start Month"];
      });
      return convertDates(startMonth[0].date, se);
    }
  }
}

export default convertMonthsToDates;
