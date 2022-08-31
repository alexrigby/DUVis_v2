import React, { useState, useEffect } from "react";
import { VegaLite } from "react-vega";
import { Handler } from "vega-tooltip";

import vegaSpec from "./functions/vegaSpec";
import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  const dates = vegaAnalyticsData.current.dates;
  const actData = vegaAnalyticsData.current.actData;
  const [brushRange, setBrushRange] = useState("");

  useEffect(() => {
    if (actData !== null) {
      setBrushRange({ start: new Date(dates[0].date), end: new Date(dates[dates.length - 1].date) });
    }
  }, [actData, dates]);

  if (brushRange !== "") {
    let range = {};
    const signalListeners = {
      brush: (...args) => {
        range = args[1].yearmonth_date !== undefined && {
          start: Object.values(args[1].yearmonth_date)[0],
          end: Object.values(args[1].yearmonth_date)[1],
        };
      },
    };

    const mouseUpHandler = (event) => {
      // if range is empty it means mousup event occured not on the graph so do Not set state again!
      if (Object.keys(range).length !== 0) {
        setBrushRange(range);
      }
    };

    const resetDoubleClick = (event) => {
      setBrushRange({ start: new Date(dates[0].date), end: new Date(dates[dates.length - 1].date) });
    };

    const { vegaData, categorys } = parseVegaData(actData, dates, brushRange);
    const spec = vegaSpec(categorys, brushRange);

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics" onMouseUp={mouseUpHandler} onDoubleClick={resetDoubleClick}>
          <div>{/* <select></select> */}</div>
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
