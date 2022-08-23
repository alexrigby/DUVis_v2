import React, { useState } from "react";

import Gantchart from "./gantchart/Gantchart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";
import PannelButtons from "./pannelButtons/PannelButtons";

import "./BottomPannel.css";

export function BottomPannel({ gantchartData, cyState, setSelectedNode, vegaAnalyticsData }) {
  const [selectedBottomVis, setSelectedBottomVis] = useState("");

  return (
    <div className="bottomPannel">
      <PannelButtons selectedBottomVis={selectedBottomVis} setSelectedBottomVis={setSelectedBottomVis} />
      <Gantchart
        gantchartData={gantchartData}
        cyState={cyState}
        setSelectedNode={setSelectedNode}
        selectedBottomVis={selectedBottomVis}
      />
      <VegaAnalytics selectedBottomVis={selectedBottomVis} vegaAnalyticsData={vegaAnalyticsData} />
    </div>
  );
}

export default BottomPannel;
