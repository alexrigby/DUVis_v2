export function vegaSpec(categorys) {
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
          // on: {
          //   type: "mousemove",
          //   between: [{ type: "mousedown" }, { type: "mouseup" }],
          // },
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
          x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
          y: { field: "y", type: "quantitative", axis: { title: "", tickMinStep: 1 } },
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
        title: "Categorys Total",
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
        orient: "bottom",
        cursor: "pointer",
        labelAlign: "middle",
        // legendX: 130,
        // legendY: 40,
      },
    },

    // note: vega-lite data attribute is a plain object instead of an array
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
