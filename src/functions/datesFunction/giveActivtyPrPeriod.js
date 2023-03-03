import { actFields } from "../../data";

export function giveActivityPrPeriod(act, dates, se) {
  const startOrEnd = se === "start" ? actFields.STARTM : actFields.ENDM;

  if (act[startOrEnd] === "Ongoing") {
    return "onGoing";
  } else if (act[startOrEnd] === "") {
    return "";
  } else {
    return dates.filter((d) => d.month === act[startOrEnd])[0].prPeriod;
  }
}

export default giveActivityPrPeriod;
