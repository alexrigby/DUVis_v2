import React, { useEffect, useRef } from "react";

// import iconByCategory from "../cytoscape/functions/iconByCategory";
import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";

import "./Legend.css";

export function Legend({ cyState, networkVeiw }) {
  const legendData = useRef({ wps: "", categorys: "" });

  useEffect(() => {
    // gets all WPS  and descriptions present in cy graph
    const wps = cyState.cy.nodes("[type = 'wp']").map((wp) => wp.data());

    const sEngagement = [...new Set(cyState.cy.edges("[network = 'yes']").map((e) => e.data("engagement")))].sort(
      function (a, b) {
        return a - b;
      }
    );
    console.log(sEngagement);
    console.log(cyState.cy.edges("[network = 'yes'][type = 'stakeholderEdge']"));

    //sort WPS in number order before adding to legend
    wps.sort(function (a, b) {
      return a.id.slice(2) - b.id.slice(2);
    });

    // // returns unique array of activity categorys
    // const categorys = [
    //   ...new Set(cyState.cy.nodes("[type = 'activityNode']").map((act) => act.data().meta["Activity Category"])),
    // ];

    // const catLegendItems = categorys.map((cat, i) => (
    //   <div key={cat} className="boxContainer">
    //     <div className="box" title={`Category: ${cat}`}>
    //       {iconByCategory(cat)}
    //     </div>
    //     <p className="legendLable" title={`Category: ${cat}`}>
    //       {cat}
    //     </p>
    //   </div>
    // ));

    const wpLegendItems = wps.map((wp) => (
      <div key={wp.id} className="boxContainer">
        <div className="box" title={`Category: ${wp.category}`} style={styleActivitiesByWP(wp.id)}></div>
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));

    // console.log(wps[0].id.slice(2));s

    legendData.current = { wps: wpLegendItems };
  }, [cyState.cy, cyState.elements.length, networkVeiw]);

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
