import React, { useState, useEffect } from "react";
import { VegaLite } from "react-vega";
import { Handler } from "vega-tooltip";

import VegaSelect from "./VegaSelect";

import vegaSpec from "./functions/vegaSpec";
import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, actDataRef, datesRef, prPeriod, setSelectedBottomVis }) {
  const dates = datesRef.current;
  const actData = actDataRef.current;

  const trimmedDates =
    dates !== null && prPeriod.pr !== null ? dates.filter((date) => date.prPeriod <= prPeriod.pr) : dates; //trimes dates data down to pr period

  const [brushRange, setBrushRange] = useState("");

  const [selectedMetric, setSelectedMetric] = useState("Activity Category");
  //sets brush range to full extent of project once the initial data is parsed
  useEffect(() => {
    if (dates !== null) {
      setBrushRange({
        start: new Date(trimmedDates[0].date).getTime(),
        end: new Date(trimmedDates[trimmedDates.length - 1].date).getTime(),
      });
    }
  }, [dates]);

  //once brush range is set generate component
  if (brushRange !== "") {
    const fullRange = {
      start: new Date(trimmedDates[0].date).getTime(),
      end: new Date(trimmedDates[trimmedDates.length - 1].date).getTime(),
    };

    //returns the brush date range
    let range = {};
    const signalListeners = {
      brush: (...args) => {
        //first click on brush returns 0 values therfore filter out undefined
        range = args[1].yearmonth_date !== undefined && {
          start: Object.values(args[1].yearmonth_date)[0],
          end: Object.values(args[1].yearmonth_date)[1],
        };
      },
    };

    //when a mouseup event happens set brushRange to latest range
    const mouseUpHandler = (event) => {
      // if range is empty it means mousup event occured not on the graph so do Not set state again!
      if (Object.keys(range).length !== 0) {
        setBrushRange(range);
      }
    };

    const resetDoubleClick = (event) => {
      setBrushRange(fullRange);
    };

    const closeVegaPannel = (event) => {
      setSelectedBottomVis("");
    };

    const { vegaData, options } = parseVegaData(actData, trimmedDates, brushRange, selectedMetric);
    const spec = vegaSpec(options, brushRange, selectedMetric);

    const title =
      brushRange.start !== fullRange.start && brushRange.end !== fullRange.end
        ? "double click to reset date range"
        : "click and drag on the time series to specify a date range";

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics" onMouseUp={mouseUpHandler} onDoubleClick={resetDoubleClick} title={title}>
          <VegaSelect setSelectedMetric={setSelectedMetric} />
          <p className="exitVega" onClick={closeVegaPannel} title="close analytics panel">
            <i className="fa fa-xmark"></i>
          </p>
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
