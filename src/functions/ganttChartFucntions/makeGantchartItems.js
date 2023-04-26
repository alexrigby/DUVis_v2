import activityOpacity from "./activityOpacity";
import { actFields, wpFields } from "../../data";
import statusOpacity from "../../configs/statusOpacity";

export function makeGantchartacts(actData, wpData, prPeriod, completedDisplay, latestPrPeriod, convertedDates) {
  // groups are work Packages
  const groups = wpData.map((wp) => ({
    id: wp[wpFields.ID],
    content: wp[wpFields.ID],
    // name: wp[wpFields.NAME],
    style: `background-color: ${wp.bgColor}; color: white`,
  }));

  const items = actData.map((act) => {
    // console.log(act.endPrPeriod);
    const startDate = new Date(act[actFields.START_DATE]).getTime();
    const endDate = new Date(act[actFields.END_DATE]).getTime();
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
      style: `background-color: ${act.bgColor}; 
      border-color: ${act.borderColor}; color: white; opacity: ${opacity}`,
    };
  });

  return { items: items, groups: groups };
}

export default makeGantchartacts;
