import { metaFields } from "../configs/metaFields";

export function giveActivityPrPeriod(act, dates, se) {
  if (se === "start") {
    if (act[metaFields.STARTM] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act[metaFields.STARTM])[0].prPeriod;
    }
  } else if (se === "end") {
    if (act[metaFields.ENDM] === "Ongoing") {
      return "onGoing";
    } else if (act[metaFields.ENDM] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act[metaFields.ENDM])[0].prPeriod;
    }
  }
}

export default giveActivityPrPeriod;
