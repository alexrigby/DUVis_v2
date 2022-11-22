import React, { useEffect, useRef } from "react";
import { ENGAGEMENT, BORDER } from "../../configs/COLORS";

// import iconByCategory from "../cytoscape/functions/iconByCategory";
import styleActivitiesByWP from "../cytoscape/functions/styleActivitiesByWP";

import "./Legend.css";

export function Legend({ cyState, networkVeiw, selectedNode }) {
  const legendData = useRef({ wps: "", categorys: "" });
  const sEngagement = useRef(null);

  useEffect(() => {
    const eng =
      selectedNode.id !== "" &&
      [
        ...new Set(
          cyState.cy
            .nodes(`#${selectedNode.id}`)
            .connectedEdges("[type = 'stakeholderEdge']")
            .map((e) => e.data("engagement"))
        ),
      ].sort(function (a, b) {
        return a - b;
      });

    const engLegendItems =
      selectedNode.id !== "" &&
      eng.map((e, i) => (
        <div key={i} className="boxContainer">
          <div className="engBox" style={styleEngLegend(e)}></div>
          <p className="legendLable">Engagement level {e}</p>
        </div>
      ));

    sEngagement.current = selectedNode.id !== "" && engLegendItems;
  }, [cyState.cy, networkVeiw, selectedNode.id]);
  // console.log(sEngagement.current);

  useEffect(() => {
    // gets all WPS  and descriptions present in cy graph
    const wps = cyState.cy.nodes("[type = 'wp']").map((wp) => wp.data());

    //sort WPS in number order before adding to legend
    wps.sort(function (a, b) {
      return a.id.slice(2) - b.id.slice(2);
    });

    const wpLegendItems = wps.map((wp) => (
      <div key={wp.id} className="boxContainer">
        <div className="box" title={`Category: ${wp.category}`} style={styleActivitiesByWP(wp.id)}></div>
        <p className="legendLable" title={`Category: ${wp.category}`}>
          {wp.id}: {wp.name}
        </p>
      </div>
    ));

    legendData.current = { wps: wpLegendItems };
  }, [cyState.cy, cyState.elements.length]);

  return (
    <div className="legend">
      <h2>Work Packages:</h2>
      {legendData.current.wps}
      {/* <h2>Categorys:</h2>
      {legendData.current.categorys} */}
      {networkVeiw && sEngagement.current.length !== 0 && <h2>Engagement Level:</h2>}
      {networkVeiw && sEngagement.current.length !== 0 && sEngagement.current}
    </div>
  );
}

export default Legend;

function styleEngLegend(eng) {
  console.log(eng);
  return eng === "1"
    ? { color: ENGAGEMENT[0], height: "2px" }
    : eng === "2"
    ? { color: ENGAGEMENT[1], height: "4px" }
    : eng === "3"
    ? { color: ENGAGEMENT[2], height: "6px" }
    : eng === "4"
    ? { color: ENGAGEMENT[3], height: "8px" }
    : BORDER.other;
}

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
