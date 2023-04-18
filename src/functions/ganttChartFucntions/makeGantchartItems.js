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

  // groups are work Packages
  const groups = wpData.map((wp) => ({
    id: wp[wpFields.ID],
    content: wp[wpFields.ID],
    // name: wp[wpFields.NAME],
    style: `background-color: ${BG[wp[wpFields.ID]]}; color: white`,
  }));

  const items = actData.map((act) => {
    const startDate = new Date(handleNonDates(act.startDate, "start")).getTime();
    const endDate = new Date(handleNonDates(act.endDate, "end")).getTime();
    const opacity = completedDisplay ? activityOpacity(act, latestPrPeriod, prPeriod) : statusOpacity.onGoing;

    // if no name is supplied then generate name from id
    const itemName = act[actFields.NAME]
      ? `${act[actFields.ID]}. ${act[actFields.NAME]}`
      : `Activity ${act[actFields.ID]}`;

    return {
      group: `WP_${act[actFields.WP]}`,
      id: act[actFields.ID],
      content: itemName,
      start: startDate,
      end: endDate,
      title: itemName,
      className: `item${act[actFields.ID]}`,
      sMonth: act[actFields.STARTM],
      style: `background-color: ${BG[`WP_${act[actFields.WP]}`]}; border-color: ${
        BORDER[`WP_${act[actFields.WP]}`]
      }; color: white; opacity: ${opacity}`,
    };
  });

  return { items: items, groups: groups };
}

export default makeGantchartacts;
