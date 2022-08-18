import COLORS from "../configs/wpColors";

export function makeGantchartacts(actData, wpData) {
  //   const groups = wpData;
  const groups = wpData.map((wp) => ({
    id: wp.id,
    content: wp.id,
    name: wp.name,
    category: wp.category,
    style: `${classActivitiesbyID(wp.id.slice(2))}; color: white`,
  }));

  const items = actData.map((act) => ({
    group: `wp${act.WP}`,
    id: act.ID,
    content: act["Activity Name"],
    start: act.startDate,
    end: act.endDate === "onGoing" || "undefined" ? "2024-01-02" : act.endDate, //if the end date is not a date value then return last date of project
    title: act.Name,
    className: `m${act["Start Month"]}`,
    sMonth: act["Start Month"],
    style: `${classActivitiesbyID(act.WP)}; color: white`,
  }));

  return { items: items, groups: groups };
}

function classActivitiesbyID(wp) {
  if (wp === "1") {
    return ` background-color: ${COLORS.bg.wp1}; border-color: ${COLORS.border.wp1}`;
  } else if (wp === "2") {
    return `background-color: ${COLORS.bg.wp2}; border-color: ${COLORS.border.wp2}`;
  } else if (wp === "3") {
    return `background-color: ${COLORS.bg.wp3}; border-color: ${COLORS.border.wp3}`;
  } else if (wp === "4") {
    return `background-color: ${COLORS.bg.wp4}; border-color: ${COLORS.border.wp4}`;
  } else if (wp === "5") {
    return `  background-color: ${COLORS.bg.wp5}; border-color: ${COLORS.border.wp5}`;
  } else if (wp === "6") {
    return `background-color: ${COLORS.bg.wp6}; border-color: ${COLORS.border.wp6}`;
  } else if (wp === "7") {
    return `background-color: ${COLORS.bg.wp7}; border-color: ${COLORS.border.wp7}`;
  } else if (wp === "8") {
    return `background-color: ${COLORS.bg.wp8}; border-color: ${COLORS.border.wp8}`;
  } else {
    return `background-color: ${COLORS.bg.other}; border-color: ${COLORS.border.other}`;
  }
}

export default makeGantchartacts;
