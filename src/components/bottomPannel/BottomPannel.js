import React, { useContext } from "react";

import ConfigContext from "../../context/ConfigContext";

import GanttChart from "./ganttChart/GanttChart";
import VegaAnalytics from "./vegaAnalytics/VegaAnalytics";

import { INCLUDE_DATES, CATEGORYS_PROVIDED } from "../../data";
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
  const config = useContext(ConfigContext);

  return (
    <div className="bottomPannel">
      {config.actFields.CATEGORYS_PROVIDED && (
        <VegaAnalytics
          selectedBottomVis={selectedBottomVis}
          actDataRef={actDataRef}
          datesRef={datesRef}
          prPeriod={prPeriod}
          setSelectedBottomVis={setSelectedBottomVis}
        />
      )}
      {/* do not generate gant chart if dates are not supplied */}
      {config.INCLUDE_DATES && (
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
