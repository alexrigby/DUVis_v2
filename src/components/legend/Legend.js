import React, { useEffect, useRef } from "react";
import COLORS from "../../configs/wpColors";

import "./Legend.css";

export function Legend({ cyState }) {
  const wpLegend = useRef("");

  useEffect(() => {
    // gets all WPS  and descriptions present in cy graph
    const wps = cyState.cy.nodes("[type = 'wp']").map((wp) => wp.data());

    console.log(wps);
    const legendItems = wps.map((wp) => (
      <div key={wp.id} className="boxContainer">
        <div className="box" title={`Category: ${wp.category}`} style={classActivitiesByWP(wp.id)}></div>{" "}
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));
    wpLegend.current = legendItems;
  }, [cyState.cy]);

  return (
    <div className="legend">
      <h2>Work Packages Legend:</h2>
      {wpLegend.current}
    </div>
  );
}

export default Legend;

function classActivitiesByWP(wp) {
  if (wp === "wp1") {
    return { backgroundColor: COLORS.bg.wp1, borderColor: COLORS.border.wp1 };
  } else if (wp === "wp2") {
    return { backgroundColor: COLORS.bg.wp2, borderColor: COLORS.border.wp2 };
  } else if (wp === "wp3") {
    return { backgroundColor: COLORS.bg.wp3, borderColor: COLORS.border.wp3 };
  } else if (wp === "wp4") {
    return { backgroundColor: COLORS.bg.wp4, borderColor: COLORS.border.wp4 };
  } else if (wp === "wp5") {
    return { backgroundColor: COLORS.bg.wp5, borderColor: COLORS.border.wp5 };
  } else if (wp === "wp6") {
    return { backgroundColor: COLORS.bg.wp6, borderColor: COLORS.border.wp6 };
  } else if (wp === "wp7") {
    return { backgroundColor: COLORS.bg.wp7, borderColor: COLORS.border.wp7 };
  } else if (wp === "wp8") {
    return { backgroundColor: COLORS.bg.wp8, borderColor: COLORS.border.wp8 };
  } else {
    return { backgroundColor: COLORS.bg.other, borderColor: COLORS.border.other };
  }
}
