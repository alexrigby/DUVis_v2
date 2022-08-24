import React from "react";
import ReactDOM from "react-dom";
import { VegaLite } from "react-vega";

import parseVegaData from "./functions/parseVegaData";
import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  const actData = vegaAnalyticsData.current.actData;
  const dates = vegaAnalyticsData.current.dates;

  if (vegaAnalyticsData.current.actData !== null) {
    const { plotData, categorys } = parseVegaData(actData, dates);

    const layers = categorys.map((cat) => ({
      mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
      params: [
        {
          name: cat,
          select: { type: "point", field: "series" },
          bind: "legend",
        },
      ],
      encoding: {
        x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
        y: { field: cat, type: "quantitative", axis: { title: "category per month", tickMinStep: 1 } },
        color: {
          field: "Categorys",
          datum: cat,
          type: "nominal",
        },
        opacity: {
          condition: { param: cat, value: 1 },
          value: 0.2,
        },
      },
    }));

    const spec = {
      width: "container",
      height: 400,
      layer: layers,
      data: { name: "values" },
      config: {
        legend: {
          field: "Categorys",
          fillColor: "white",
          strokeColor: "lightgrey",
          strokeWidth: 4,
          cornerRadius: 6,
          padding: 3,
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
