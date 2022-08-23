import React from "react";
import ReactDOM from "react-dom";
import { VegaLite } from "react-vega";

import "./VegaAnalytics.css";

export function VegaAnalytics({ selectedBottomVis, vegaAnalyticsData }) {
  const actData = vegaAnalyticsData.current.actData;
  const dates = vegaAnalyticsData.current.dates;

  if (vegaAnalyticsData.current.actData !== null) {
    //unique category names
    const categorys = [...new Set(actData.map((act) => act["Activity Category"]))];
    //get groups of each activities in category
    const activityByCategory = categorys.map((category) =>
      actData.filter((act) => act["Activity Category"] === category)
    );
    //add Activity count per month to date array
    const categoryPerDate = activityByCategory.map((catAct) =>
      dates.map((date) => ({
        [catAct[0]["Activity Category"]]: catAct.filter(
          (act) => new Date(date.date) >= new Date(act.startDate) && new Date(date.date) < new Date(act.endDate)
        ).length,
        ...date,
      }))
    );

    //flatten array or arrays and merge based on date collumn
    let plotData = {};
    categoryPerDate.flat().forEach((a) => (plotData[a.date] = { ...plotData[a.date], ...a }));
    plotData = Object.values(plotData);

    console.log({ values: plotData });

    const pub = actData.filter((pub) => pub["Activity Category"] === "Publication");
    const pubCount = {
      values: dates.map((date) => ({
        pub: pub.filter(
          (p) => new Date(date.date) >= new Date(p.startDate) && new Date(date.date) <= new Date(p.endDate)
        ).length,
        ...date,
      })),
    };

    const spec = {
      width: 400,
      height: 200,
      mark: { type: "line", color: "#0084FF", interpolate: "monotone" },
      encoding: {
        x: { timeUnit: "yearmonthdate", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
        y: { field: { repeat: "layer" }, type: "quantitative", axis: { title: "quantity" } },
      },
      data: { name: "values" }, // note: vega-lite data attribute is a plain object instead of an array
    };

    if (selectedBottomVis === "vegaAnalyticsButton") {
      return (
        <div className="vegaAnalytics">
          <VegaLite spec={spec} data={{ values: plotData }} />
        </div>
      );
    }
  }
}
// repeat={{ layer: [categorys.map((c) => c)] }}
export default VegaAnalytics;
