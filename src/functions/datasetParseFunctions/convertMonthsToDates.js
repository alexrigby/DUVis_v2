import convertDates from "./convertDates";
import { metaFields } from "../../configs/metaFields";

// converts to JS readable date format
export function convertMonthsToDates(act, months, se) {
  if (se === "end") {
    //if the end or start month is undefined or ongoing then return that
    if (act[metaFields.ENDM] === "Ongoing") {
      return "onGoing";
    } else if (act[metaFields.ENDM] === "") {
      return "undefined";
      //else return the date coresponding to the month number (from the date file)
    } else {
      var endMonth = months.filter(function (d) {
        return d.month === act[metaFields.ENDM];
      });
      return convertDates(endMonth[0].date, se);
    }
  } else if (se === "start") {
    if (act[metaFields.STARTM] === "") {
      return "undefined";
    } else {
      var startMonth = months.filter(function (d) {
        return d.month === act[metaFields.STARTM];
      });
      return convertDates(startMonth[0].date, se);
    }
  }
}

export default convertMonthsToDates;
