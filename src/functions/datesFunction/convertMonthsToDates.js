import { actFields } from "../../data";

// converts to JS readable date format
export function convertMonthsToDates(act, months, se) {
  if (se === "end") {
    //if the end or start month is undefined or ongoing then return that
    if (act[actFields.ENDM] === "Ongoing") {
      return "onGoing";
    } else if (act[actFields.ENDM] === "") {
      return "undefined";
      //else return the date coresponding to the month number (from the date file)
    } else {
      var endMonth = months.filter(function (d) {
        return d.month === act[actFields.ENDM];
      });
      var endDate = endMonth[0].date.split("-");
      endDate[2] = getLastDayOfMonth(endDate[0], endDate[1]);

      return endDate.join("-");
    }
  } else if (se === "start") {
    if (act[actFields.STARTM] === "") {
      return "undefined";
    } else {
      var startMonth = months.filter(function (d) {
        return d.month === act[actFields.STARTM];
      });
      return startMonth[0].date;
    }
  }
}

export default convertMonthsToDates;

function getLastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}
