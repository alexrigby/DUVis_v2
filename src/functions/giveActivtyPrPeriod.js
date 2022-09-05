export function giveActivityPrPeriod(act, dates, se) {
  if (se === "start") {
    if (act["Start Month"] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act["Start Month"])[0].prPeriod;
    }
  } else if (se === "end") {
    if (act["End Month/ Ongoing"] === "Ongoing") {
      return "onGoing";
    } else if (act["End Month/ Ongoing"] === "") {
      return "undefined";
    } else {
      return dates.filter((d) => d.month === act["End Month/ Ongoing"])[0].prPeriod;
    }
  }
}

export default giveActivityPrPeriod;
