import React from "react";

import GanttChart from "./ganttChart/GanttChart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";

import "./BottomPannel.css";

export function BottomPannel({
  gantchartData,
  cyState,
  setSelectedNode,
  actDataRef,
  datesRef,
  prPeriod,
  selectedBottomVis,
}) {
  return (
    <div className="bottomPannel">
      <VegaAnalytics
        selectedBottomVis={selectedBottomVis}
        actDataRef={actDataRef}
        datesRef={datesRef}
        prPeriod={prPeriod}
      />
      <GanttChart
        gantchartData={gantchartData}
        cyState={cyState}
        setSelectedNode={setSelectedNode}
        selectedBottomVis={selectedBottomVis}
        datesRef={datesRef}
      />
    </div>
  );
}

export default BottomPannel;
