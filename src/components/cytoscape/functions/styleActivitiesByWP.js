import { BG, BORDER } from "../../../configs/COLORS";

export function styleActivitiesByWP(wp) {
  if (wp === "wp1") {
    return { backgroundColor: BG.wp1, borderColor: BORDER.wp1 };
  } else if (wp === "wp2") {
    return { backgroundColor: BG.wp2, borderColor: BORDER.wp2 };
  } else if (wp === "wp3") {
    return { backgroundColor: BG.wp3, borderColor: BORDER.wp3 };
  } else if (wp === "wp4") {
    return { backgroundColor: BG.wp4, borderColor: BORDER.wp4 };
  } else if (wp === "wp5") {
    return { backgroundColor: BG.wp5, borderColor: BORDER.wp5 };
  } else if (wp === "wp6") {
    return { backgroundColor: BG.wp6, borderColor: BORDER.wp6 };
  } else if (wp === "wp7") {
    return { backgroundColor: BG.wp7, borderColor: BORDER.wp7 };
  } else if (wp === "wp8") {
    return { backgroundColor: BG.wp8, borderColor: BORDER.wp8 };
  } else {
    return { backgroundColor: BG.other, borderColor: BORDER.other };
  }
}

export default styleActivitiesByWP;
