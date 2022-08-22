import React, { useState } from "react";

import Gantchart from "./gantchart/Gantchart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";
import PannelButtons from "./pannelButtons/PannelButtons";

import "./BottomPannel.css";

export function BottomPannel({ gantchartData, cyState, setSelectedNode }) {
  const [buttonsUp, setButtonsUp] = useState(false);

  return (
    <div className="bottomPannel">
      <PannelButtons buttonsUp={buttonsUp} setButtonsUp={setButtonsUp} />
      <Gantchart gantchartData={gantchartData} cyState={cyState} setSelectedNode={setSelectedNode} />
      <VegaAnalytics />
    </div>
  );
}

export default BottomPannel;
