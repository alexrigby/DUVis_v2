import React, { useEffect, useRef } from "react";
import COLORS from "../../configs/wpColors";

import iconByCategory from "./categoryIcon";

import "./Legend.css";

export function Legend({ cyState }) {
  const legendData = useRef({ wps: "", categorys: "" });

  useEffect(() => {
    // gets all WPS  and descriptions present in cy graph
    const wps = cyState.cy.nodes("[type = 'wp']").map((wp) => wp.data());
    // returns unique array of activity categorys
    const categorys = [
      ...new Set(cyState.cy.nodes("[type = 'activityNode']").map((act) => act.data().meta["Activity Category"])),
    ];
    console.log(iconByCategory("Activity"));

    const catLegendItems = categorys.map((cat, i) => (
      <div key={cat} className="boxContainer">
        <div className="box" title={`Category: ${cat}`}>
          {iconByCategory(cat)}
        </div>
        <p className="legendLable" title={`Category: ${cat}`}>
          {cat}
        </p>
      </div>
    ));

    const wpLegendItems = wps.map((wp) => (
      <div key={wp.id} className="boxContainer">
        <div className="box" title={`Category: ${wp.category}`} style={classActivitiesByWP(wp.id)}></div>
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));

    legendData.current = { wps: wpLegendItems, categorys: catLegendItems };
  }, [cyState.cy]);

  return (
    <div className="legend">
      <h2>Work Packages Legend:</h2>
      {legendData.current.wps}
      <h2>Category Legend:</h2>
      {legendData.current.categorys}
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
