import React, { useState } from "react";

import GanttChart from "./ganttChart/GanttChart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";
import PannelButtons from "./pannelButtons/PannelButtons";

import "./BottomPannel.css";

export function BottomPannel({ gantchartData, cyState, setSelectedNode, actDataRef, datesRef, prPeriod }) {
  const [selectedBottomVis, setSelectedBottomVis] = useState("");

  return (
    <div className="bottomPannel">
      <PannelButtons selectedBottomVis={selectedBottomVis} setSelectedBottomVis={setSelectedBottomVis} />
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
