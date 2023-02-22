import { BG, BORDER } from "../../configs/COLORS";
import activityOpacity from "./activityOpacity";
import { actFields, wpFields } from "../../data";
import statusOpacity from "../../configs/statusOpacity";

export function makeGantchartacts(actData, wpData, prPeriod, completedDisplay, latestPrPeriod, convertedDates) {
  function handleNonDates(date, startOrEnd) {
    const startDate = convertedDates[0].date;
    const endDate = convertedDates[convertedDates.length - 1].date;

    if (date === "onGoing" || date === "undefined") {
      return startOrEnd === "start" ? startDate : endDate;
    } else {
      return date;
    }
  }

  const groups = wpData.map((wp) => ({
    id: wp[wpFields.ID],
    content: wp[wpFields.ID],
    name: wp[wpFields.NAME],
    category: wp[wpFields.CATEGORY],
    style: `background-color: ${BG[wp[wpFields.ID]]}; color: white`,
  }));

  const items = actData.map((act) => {
    const startDate = new Date(handleNonDates(act.startDate, "start")).getTime();
    const endDate = new Date(handleNonDates(act.endDate, "end")).getTime();
    const opacity = completedDisplay ? activityOpacity(act, latestPrPeriod, prPeriod) : statusOpacity.onGoing;

    return {
      group: `wp${act[actFields.WP]}`,
      id: act[actFields.ID],
      content: `${act[actFields.ID]}. ${act[actFields.ACTIVITY]}`,
      start: startDate,
      end: endDate,
      title: act[actFields.ACTIVITY],
      className: `item${act.ID}`,
      sMonth: act[actFields.STARTM],
      style: `background-color: ${BG[`wp${act.WP}`]}; border-color: ${
        BORDER[`wp${act.WP}`]
      }; color: white; opacity: ${opacity}`,
    };
  });

  return { items: items, groups: groups };
}

export default makeGantchartacts;
