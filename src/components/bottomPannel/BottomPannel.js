import React from "react";

import GanttChart from "./ganttChart/GanttChart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";

import { INCLUDE_DATES } from "../../data";
import "./BottomPannel.css";

export function BottomPannel({
  gantchartDataRef,
  cyState,
  setSelectedNode,
  actDataRef,
  datesRef,
  prPeriod,
  selectedBottomVis,
  setSelectedBottomVis,
}) {
  return (
    <div className="bottomPannel">
      <VegaAnalytics
        selectedBottomVis={selectedBottomVis}
        actDataRef={actDataRef}
        datesRef={datesRef}
        prPeriod={prPeriod}
        setSelectedBottomVis={setSelectedBottomVis}
        INCLUDE_DATES={INCLUDE_DATES}
      />
      {/* do not generate gant chart if dates are not supplied */}
      {INCLUDE_DATES && (
        <GanttChart
          gantchartDataRef={gantchartDataRef}
          cyState={cyState}
          setSelectedNode={setSelectedNode}
          selectedBottomVis={selectedBottomVis}
          datesRef={datesRef}
        />
      )}
    </div>
  );
}

export default BottomPannel;
