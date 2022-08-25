import React from "react";
import { VegaLite } from "react-vega";

import vegaSpec from "./functions/vegaSpec";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  if (vegaAnalyticsData.current.actData !== null) {
    const { spec, vegaData } = vegaSpec(vegaAnalyticsData.current.actData, vegaAnalyticsData.current.dates);

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics">
          <VegaLite data={vegaData} spec={spec} actions={false} />
        </div>
      );
    }
  }
}

export default VegaAnalytics;
