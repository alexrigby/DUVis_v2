import React, { useState, useRef } from "react";
import { VegaLite } from "react-vega";
import { Handler } from "vega-tooltip";

import vegaSpec from "./functions/vegaSpec";
import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  const dates = vegaAnalyticsData.current.dates;
  const actData = vegaAnalyticsData.current.actData;
  const brushRange = useRef("");

  if (vegaAnalyticsData.current.actData !== null) {
    brushRange.current = { start: new Date(dates[0].date), end: new Date(dates[dates.length - 1].date) };

    const signalListeners = {
      brush: (...args) => {
        console.log(args);

        brushRange.current = args;
      },
    };

    const { vegaData, categorys } = parseVegaData(actData, dates, brushRange);
    const spec = vegaSpec(categorys);

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics">
          <VegaLite
            data={vegaData}
            spec={spec}
            actions={false}
            tooltip={new Handler().call}
            signalListeners={signalListeners}
          />
        </div>
      );
    }
  }
}

export default VegaAnalytics;
