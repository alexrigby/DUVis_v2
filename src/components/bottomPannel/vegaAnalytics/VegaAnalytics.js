import React, { useState, useEffect, useContext } from "react";
import { VegaLite } from "react-vega";
import { Handler } from "vega-tooltip";
import ConfigContext from "../../../context/ConfigContext";
import VegaSelect from "./VegaSelect";

import vegaSpec from "./functions/vegaSpec";
import vegaSpecNoDate from "./functions/vegaSpecNoDate";
import parseVegaData from "./functions/parseVegaData";
import getTypeOptionsArray from "../../../AppFunctions/getTypeOptionsArray";

import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, actDataRef, datesRef, prPeriod, setSelectedBottomVis }) {
  const { config } = useContext(ConfigContext);
  const actFields = config.actFields;

  // ------------------------- SET STATE -----------------------------------------------------------//
  const categoryArray = getTypeOptionsArray(actFields.META_FIELDS, "category"); //all categorical fileds

  const [brushRange, setBrushRange] = useState(""); // BRUSH RANGE STATE (ONLY USED IF DATE IS SUPPLIED)
  const [selectedMetric, setSelectedMetric] = useState(categoryArray[0]);

  const closeVegaPannel = (event) => {
    setSelectedBottomVis("");
  };

  //------------------------USEFUL VARIABLES---------------------------------------------//
  const DATES = datesRef.current;
  const ACT_DATA = actDataRef.current;
  const options = ACT_DATA && [...new Set(ACT_DATA.map((act) => act[selectedMetric]))]; //unique category names for the selected metric
  const trimmedDates =
    DATES !== null && prPeriod.pr !== null ? DATES.filter((date) => date.prPeriod <= prPeriod.pr) : DATES; //trims dates object to match pr period

  //sets brush range to full extent of project once the initial data is parsed
  useEffect(() => {
    if (DATES !== null && config.INCLUDE_DATES) {
      setBrushRange({
        start: new Date(trimmedDates[0].date).getTime(),
        end: new Date(trimmedDates[trimmedDates.length - 1].date).getTime(),
      });
    }
  }, [DATES]);

  //-------------------------IF USER SUPPLIES DATES-----------------------------------//
  //if brush range is set AND Dates are provided by the user generate both charts
  if (brushRange !== "" && config.INCLUDE_DATES) {
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

    const vegaData = parseVegaData(ACT_DATA, trimmedDates, brushRange, selectedMetric, options, categoryArray);
    const spec = vegaSpec(options, brushRange, selectedMetric);
    console.log(selectedMetric);
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
    //----------------------IF NO DATE IS SUPPLIED BY USER THEN ONLY GENERATE BAR CHART-------------------------------------------//
  } else if (!config.INCLUDE_DATES && ACT_DATA) {
    console.log("test");
    const noDateSpec = vegaSpecNoDate(selectedMetric);
    const noDateVegaData = {
      vegaData: options.map((ops) => ({
        [selectedMetric]: ops,
        count: ACT_DATA.filter((act) => act[selectedMetric] === ops).length,
      })),
    };

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics">
          <VegaSelect setSelectedMetric={setSelectedMetric} />
          <p className="exitVega" onClick={closeVegaPannel} title="close analytics panel">
            <i className="fa fa-xmark"></i>
          </p>
          <VegaLite data={noDateVegaData} spec={noDateSpec} actions={false} tooltip={new Handler().call} />
        </div>
      );
    }
  }
}

export default VegaAnalytics;
