import React, { useEffect, useRef } from "react";

import iconByCategory from "../cytoscape/functions/iconByCategory";
import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";

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
        <div className="box" title={`Category: ${wp.category}`} style={styleActivitiesByWP(wp.id)}></div>
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));

    legendData.current = { wps: wpLegendItems, categorys: catLegendItems };
  }, [cyState.cy, cyState.elements.length]);

  return (
    <div className="legend">
      <h2>Work Packages:</h2>
      {legendData.current.wps}
      {/* <h2>Categorys:</h2>
      {legendData.current.categorys} */}
    </div>
  );
}

export default Legend;
