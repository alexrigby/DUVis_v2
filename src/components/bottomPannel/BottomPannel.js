import React, { useState } from "react";

import GanttChart from "./ganttChart/GanttChart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";
import PannelButtons from "./pannelButtons/PannelButtons";

import "./BottomPannel.css";

export function BottomPannel({ gantchartData, cyState, setSelectedNode, vegaAnalyticsData }) {
  const [selectedBottomVis, setSelectedBottomVis] = useState("");

  // vegaAnalyticsButton;

  return (
    <div className="bottomPannel">
      <PannelButtons selectedBottomVis={selectedBottomVis} setSelectedBottomVis={setSelectedBottomVis} />
      <VegaAnalytics selectedBottomVis={selectedBottomVis} vegaAnalyticsData={vegaAnalyticsData} />
      <GanttChart
        gantchartData={gantchartData}
        cyState={cyState}
        setSelectedNode={setSelectedNode}
        selectedBottomVis={selectedBottomVis}
      />
    </div>
  );
}

export default BottomPannel;
