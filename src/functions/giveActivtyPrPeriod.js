import { actFields } from "../data";

export function giveActivityPrPeriod(act, dates, se) {
  if (se === "start") {
    if (act[actFields.STARTM] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act[actFields.STARTM])[0].prPeriod;
    }
  } else if (se === "end") {
    if (act[actFields.ENDM] === "Ongoing") {
      return "onGoing";
    } else if (act[actFields.ENDM] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act[actFields.ENDM])[0].prPeriod;
    }
  }
}

export default giveActivityPrPeriod;
