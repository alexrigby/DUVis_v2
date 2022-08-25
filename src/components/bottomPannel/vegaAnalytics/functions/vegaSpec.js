import parseVegaData from "./parseVegaData";

export function vegaSpec(actData, dates) {
  const { vegaData, categorys } = parseVegaData(actData, dates);

  const timeSeriesLayers = categorys.map((cat, i) => ({
    mark: { type: "line", strokeWidth: 3, interpolate: "monotone" },
    params: [
      {
        name: `param-${i}`,
        select: { type: "point", fields: ["category"] },
        bind: "legend",
      },
    ],
    encoding: {
      x: { timeUnit: "yearmonth", field: "date", title: "date", type: "temporal", axis: { title: "Date" } },
      y: { field: cat, type: "quantitative", axis: { title: "", tickMinStep: 1 } },
      color: {
        field: "category",
        datum: cat,
      },
      opacity: {
        condition: { param: `param-${i}`, value: 1 },
        value: 0.2,
      },
    },
  }));

  const spec = {
    // width: "container",
    // height: "container",
    padding: 20,
    data: { name: "vegaData" },
    vconcat: [
      {
        width: "container",
        layer: timeSeriesLayers,
      },
      {
        width: "container",
        mark: "bar",
        encoding: {
          x: { field: "category", type: "ordinal" },
          y: { field: "count", type: "quantitative" },
          color: {
            field: "category",
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
