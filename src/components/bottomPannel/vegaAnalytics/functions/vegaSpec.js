export function vegaSpec(categorys, brushRange) {
  const startDate = new Date(brushRange.start);
  const endDate = new Date(brushRange.end);
  const spec = {
    padding: 20,
    data: { name: "vegaData" },
    tooltip: true,
    params: [
      {
        name: "legendSelect",
        select: { type: "point", fields: ["category"] },
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
        title: "Categorys per Month",
        width: "container",
        transform: [{ fold: categorys, as: ["category", "y"] }], //adds all relivent input feilds to one layer
        mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
        encoding: {
          x: {
            timeUnit: "yearmonth",
            field: "date",
            title: "date",
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
          tooltip: { field: "y", type: "quantitative" },
          color: {
            field: "category",
            type: "nominal",
          },
          opacity: {
            condition: { param: "legendSelect", value: 1 },
            value: 0.2,
          },
        },
      },
      {
        width: "container",
        title: `Categorys Total Between ${startDate.toLocaleDateString("en-GB")} and ${endDate.toLocaleDateString(
          "en-GB"
        )}`,
        mark: "bar",
        encoding: {
          x: { field: "category", type: "ordinal", axis: { title: "", labelAngle: 0 } },
          y: { field: "count", type: "quantitative", axis: { title: "" } },
          tooltip: { field: "count", type: "quantitative" },
          color: {
            field: "category",
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
        field: "category",
        title: "",
        fillColor: "white",
        // strokeColor: "grey",
        // strokeWidth: 4,
        // cornerRadius: 6,
        // padding: 6,
        // orient: "top-right",
        labelFontSize: 12,
        symbolStrokeWidth: 4,
        direction: "horizontal",
        orient: "top",
        cursor: "pointer",
        labelAlign: "middle",
        // legendX: 130,
        // legendY: 40,
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
