import { BG, BORDER } from "../../configs/COLORS";
import activityOpacity from "./activityOpacity";
import { actFields, wpFields } from "../../data";
import statusOpacity from "../../configs/statusOpacity";

export function makeGantchartacts(actData, wpData, prPeriod, completedDisplay, latestPrPeriod, convertedDates) {
  function handleNonDates(date, startOrEnd) {
    if (date === "onGoing" || date === "undefined") {
      return startOrEnd === "start" ? convertedDates[0].date : convertedDates[convertedDates.length - 1].date;
    } else {
      return date;
    }
  }

  // console.log(latestPrPeriod, "lpr");
  // console.log(prPeriod, "p");

  const groups = wpData.map((wp) => ({
    id: wp[wpFields.ID],
    content: wp[wpFields.ID],
    name: wp[wpFields.NAME],
    category: wp[wpFields.CATEGORY],
    style: `background-color: ${BG[wp[wpFields.ID]]}; color: white`,
  }));

  const items = actData.map((act) => {
    return {
      group: `wp${act[actFields.WP]}`,
      id: act[actFields.ID],
      content: `${act[actFields.ID]}. ${act[actFields.ACTIVITY]}`,
      start: new Date(handleNonDates(act.startDate, "start")).getTime(),
      end: new Date(handleNonDates(act.endDate, "end")).getTime(), //if the end date is not a date value then return last date of project
      title: act[actFields.ACTIVITY],
      className: `item${act.ID}`,
      sMonth: act[actFields.STARTM],
      style: `background-color: ${BG[`wp${act.WP}`]}; border-color: ${BORDER[`wp${act.WP}`]}; color: white; opacity: ${
        completedDisplay ? activityOpacity(act, latestPrPeriod, prPeriod) : statusOpacity.onGoing
      }`,
    };
  });

  return { items: items, groups: groups };
}

export default makeGantchartacts;
