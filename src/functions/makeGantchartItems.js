import { BG, BORDER } from "../configs/COLORS";
import activityOpacity from "./activityOpacity";
import { actFields, wpFields } from "../data";

export function makeGantchartacts(actData, wpData, prPeriod, completedDisplay, latestPrPeriod, convertedDates) {
  function handleNonDates(date, startOrEnd) {
    if (date === "onGoing" || date === "undefined") {
      return startOrEnd === "start" ? convertedDates[0].date : convertedDates[convertedDates.length - 1].date;
    } else {
      return date;
    }
  }

  const groups = wpData.map((wp) => ({
    id: wp[wpFields.ID],
    content: wp[wpFields.ID],
    name: wp[wpFields.NAME],
    category: wp[wpFields.CATEGORY],
    style: `${classActivitiesbyID(wp[wpFields.ID].slice(2))}; color: white`,
  }));

  const items = actData.map((act) => ({
    group: `wp${act[actFields.WP]}`,
    id: act[actFields.ID],
    content: `${act[actFields.ID]}. ${act[actFields.ACTIVITY]}`,
    start: new Date(handleNonDates(act.startDate, "start")).getTime(),
    end: new Date(handleNonDates(act.endDate, "end")).getTime(), //if the end date is not a date value then return last date of project
    title: act[actFields.ACTIVITY],
    className: `item${act.ID}`,
    sMonth: act[actFields.STARTM],
    style: `${classActivitiesbyID(act.WP)}; color: white; opacity: ${activityOpacity(
      act,
      completedDisplay,
      latestPrPeriod,
      prPeriod
    )}`,
  }));

  return { items: items, groups: groups };
}

function classActivitiesbyID(wp) {
  if (wp === "1") {
    return ` background-color: ${BG.wp1}; border-color: ${BORDER.wp1}`;
  } else if (wp === "2") {
    return `background-color: ${BG.wp2}; border-color: ${BORDER.wp2}`;
  } else if (wp === "3") {
    return `background-color: ${BG.wp3}; border-color: ${BORDER.wp3}`;
  } else if (wp === "4") {
    return `background-color: ${BG.wp4}; border-color: ${BORDER.wp4}`;
  } else if (wp === "5") {
    return `  background-color: ${BG.wp5}; border-color: ${BORDER.wp5}`;
  } else if (wp === "6") {
    return `background-color: ${BG.wp6}; border-color: ${BORDER.wp6}`;
  } else if (wp === "7") {
    return `background-color: ${BG.wp7}; border-color: ${BORDER.wp7}`;
  } else if (wp === "8") {
    return `background-color: ${BG.wp8}; border-color: ${BORDER.wp8}`;
  } else {
    return `background-color: ${BG.other}; border-color: ${BORDER.other}`;
  }
}

export default makeGantchartacts;
