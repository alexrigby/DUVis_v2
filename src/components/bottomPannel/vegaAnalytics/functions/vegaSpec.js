export function vegaSpec(options, brushRange, selectedMetric) {
  // const selectedMetric = "Activity Category";

  const startDate = brushRange.start;
  const endDate = brushRange.end;

  const spec = {
    padding: 20,
    data: { name: "vegaData" },
    tooltip: true,
    params: [
      {
        name: "legendSelect",
        select: { type: "point", fields: [selectedMetric] },
        bind: "legend",
      },
      {
        name: "brush",
        select: {
          type: "interval",
          encodings: ["x"],
        },
      },
    ],
    vconcat: [
      {
        title: `${selectedMetric} per Month`,
        width: "container",
        transform: [{ fold: options, as: [selectedMetric, "y"] }], //adds all relivent input feilds to one layer
        mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
        encoding: {
          x: {
            timeUnit: "yearmonth",
            field: "date",
            type: "temporal",

            axis: {
              title: null,
              labelAlign: "left",
              tickSize: 30,
              gridDash: {
                condition: { test: { field: "value", timeUnit: "month", equal: 1 }, value: [] },
                value: [2, 2],
              },
              tickDash: {
                condition: { test: { field: "value", timeUnit: "month", equal: 1 }, value: [] },
                value: [2, 2],
              },
              labelOffset: 4,
              labelPadding: -24,
              labelExpr:
                "[timeFormat(datum.value, '%b'), timeFormat(datum.value, '%m') == '01' ? timeFormat(datum.value, '%Y') : '']",
            },
          },
          y: {
            field: "y",
            type: "quantitative",
            axis: { title: "", tickMinStep: 1 },
          },
          scale: { domain: { param: "brush" } },
          color: {
            // condition: {
            //   test: `datum['${selectedMetric}'] === '0'`,
            //   value: "pink",
            // },
            // condition: { test: `datum['${selectedMetric}'] === "undefined" `, value: "grey" },
            field: selectedMetric,
            type: "nominal",
          },
          opacity: {
            condition: { param: "legendSelect", value: 1 },
            value: 0.2,
          },
        },
        // layer: [
        //   {
        //     data: {
        //       values: [{ date: startDate }, { date: endDate }],
        //     },
        //     mark: { type: "rule", strokeDash: [2, 2], size: 2 },
        //     encoding: {
        //       x: { field: "date", type: "temporal", timeUnit: "yearmonth" },
        //     },
        //   },
        // ],
      },

      {
        width: "container",
        title: `${selectedMetric} Total Between ${new Date(startDate).toLocaleDateString("en-GB")} and ${new Date(
          endDate
        ).toLocaleDateString("en-GB")}`,
        mark: "bar",
        encoding: {
          x: { field: selectedMetric, type: "ordinal", axis: { title: "", labelAngle: 0 } },
          y: { field: "count", type: "quantitative", axis: { title: "" } },
          tooltip: { field: "count", type: "quantitative" },
          color: {
            condition: { test: `datum['${selectedMetric}'] === "undefined" `, value: "grey" },
            field: selectedMetric,
          },
          opacity: {
            condition: { param: `legendSelect`, value: 1 },
            value: 0.2,
          },
        },
      },
    ],
    config: {
      view: { stroke: null },

      legend: {
        symbolStrokeColor: "grey",
        // "datum.label == 'undefind' ? 'grey' : 'pink'",
        // field: selectedMetric,
        title: "",
        fillColor: "white",
        labelFontSize: 12,
        symbolStrokeWidth: 10,
        direction: "horizontal",
        orient: "top",
        cursor: "pointer",
        labelAlign: "middle",
      },
    },
  };

  return spec;
}

export default vegaSpec;

//PREVIOUSLY MADE LAYERS FOR EACH ITEM< NOW I HAVE USED "transfor: fold" ----- ALLOWS PARAM BINDING

// const timeSeriesLayers = categorys.map((cat, i) => ({
//   mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
//   params: [
//     {
//       name: `param-${i}`,
//       select: { type: "point", fields: ["category"] },
//       bind: "legend",
//     },
//   ],
//   encoding: {
//     x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
//     y: { field: cat, type: "quantitative", axis: { title: "", tickMinStep: 1 } },
//     color: {
//       field: "category",
//       datum: cat,
//     },
//     opacity: {
//       condition: { param: `param-${i}`, value: 1 },
//       value: 0.2,
//     },
//   },
// }));
