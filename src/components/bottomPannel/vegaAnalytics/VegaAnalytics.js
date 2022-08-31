import React, { useState, useRef, useEffect } from "react";
import { VegaLite } from "react-vega";
import { Handler } from "vega-tooltip";

import vegaSpec from "./functions/vegaSpec";
import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  const dates = vegaAnalyticsData.current.dates;
  const actData = vegaAnalyticsData.current.actData;
  const [brush, setBrush] = useState("");

  useEffect(() => {
    if (actData !== null) {
      setBrush({ start: new Date(dates[0].date), end: new Date(dates[dates.length - 1].date) });
    }
  }, [actData, dates]);

  if (brush !== "") {
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
      setBrush(range);
    };

    const { vegaData, categorys } = parseVegaData(actData, dates, brush);
    const spec = vegaSpec(categorys, brush);

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics" onMouseUp={mouseUpHandler}>
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
