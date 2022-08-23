import convertDates from "./convertDates";

// converts to JS readable date format
export function convertMonthsToDates(actData, months) {
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
      return convertDates(endMonth[0].date, "end");
    }
  });

  const startDates = actData.map((actD) => {
    if (actD["Start Month"] === "") {
      return "undefined";
    } else {
      var startMonth = months.filter(function (d) {
        return d.month === actD["Start Month"];
      });
      return convertDates(startMonth[0].date, "start");
    }
  });

  return { startDates, endDates };
}

export default convertMonthsToDates;
