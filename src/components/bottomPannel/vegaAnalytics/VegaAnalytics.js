import React from "react";
import ReactDOM from "react-dom";
import { VegaLite } from "react-vega";

import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  if (vegaAnalyticsData.current.actData !== null) {
    const { plotData, categorys } = parseVegaData(vegaAnalyticsData.current.actData, vegaAnalyticsData.current.dates);
    console.log("render");
    const layers = categorys.map((cat, i) => ({
      mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
      params: [
        {
          name: `param-${i}`,
          select: { type: "point", fields: ["Categorys"] },
          bind: "legend",
        },
      ],
      encoding: {
        x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
        y: { field: cat, type: "quantitative", axis: { title: "", tickMinStep: 1 } },
        color: {
          field: "Categorys",
          datum: cat,
        },
        opacity: {
          condition: { param: `param-${i}`, value: 1 },
          value: 0.2,
        },
      },
    }));

    const spec = {
      width: "container",
      height: 400,
      layer: layers,
      data: { name: "values" },
      strokeOpacity: 0.3,
      config: {
        legend: {
          field: "Categorys",
          fillColor: "white",
          strokeColor: "grey",
          strokeWidth: 4,
          cornerRadius: 6,
          padding: 6,
          orient: "top-right",
          labelFontSize: 12,
          symbolStrokeWidth: 4,
        },
      },
      // note: vega-lite data attribute is a plain object instead of an array
    };

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics">
          <VegaLite data={{ values: plotData }} spec={spec} actions={false} />
        </div>
      );
    }
  }
}

export default VegaAnalytics;
