import parseVegaData from "./parseVegaData";

export function vegaSpec(actData, dates) {
  const { vegaData, categorys } = parseVegaData(actData, dates);

  const spec = {
    padding: 20,
    data: { name: "vegaData" },
    params: [
      {
        name: "legendSelect",
        select: { type: "point", fields: ["category"] },
        bind: "legend",
      },
    ],
    vconcat: [
      {
        width: "container",
        transform: [{ fold: categorys, as: ["category", "y"] }], //adds all relivent input feilds to one layer
        mark: { type: "area", strokeWidth: 3, interpolate: "monotone" },
        encoding: {
          x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
          y: { field: "y", type: "quantitative", axis: { title: "", tickMinStep: 1 } },
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
        mark: "bar",
        encoding: {
          x: { field: "category", type: "ordinal", axis: { labelAngle: 0 } },
          y: { field: "count", type: "quantitative", axis: { title: "" } },
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

  return { spec: spec, vegaData: vegaData };
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
