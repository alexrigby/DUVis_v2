import React from "react";
import ReactDOM from "react-dom";
import { VegaLite } from "react-vega";

import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  console.log(vegaAnalyticsData);
  const spec = {
    width: 400,
    height: 200,
    mark: { type: "area", color: "#0084FF", interpolate: "monotone" },
    encoding: {
      x: { timeUnit: "yearmonthdate", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
      y: { field: "active_users", type: "quantitative", axis: { title: "quantity" } },
    },
    data: { name: "values" }, // note: vega-lite data attribute is a plain object instead of an array
  };

  const barData = {
    values: [
      { active_users: 0, date: "2019-10-01" },
      { active_users: 2, date: "2019-10-02" },
      { active_users: 0, date: "2019-10-03" },
      { active_users: 1, date: "2019-10-04" },
      { active_users: 0, date: "2019-10-05" },
      { active_users: 0, date: "2019-10-06" },
      { active_users: 1, date: "2019-10-07" },
    ],
  };

  if (selectedBottomVis === "vegaAnalyticsButton") {
    return (
      <div className="vegaAnalytics">
        <VegaLite spec={spec} data={barData} />
      </div>
    );
  }
}

export default VegaAnalytics;
