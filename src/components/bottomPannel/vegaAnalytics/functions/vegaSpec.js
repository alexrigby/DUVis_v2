export function vegaSpec(options, brushRange, selectedMetric) {
  const startDate = brushRange.start;
  const endDate = brushRange.end;

  const spec = {
    padding: 20,
    data: { name: "vegaData" },
    tooltip: true,
    vconcat: [
      {
        title: `${selectedMetric} per Month`,
        width: "container",
        transform: [{ fold: options, as: [selectedMetric, "y"] }], //adds all relivent input feilds to one layer
        layer: [
          {
            params: [
              {
                name: "brush",
                select: {
                  type: "interval",
                  encodings: ["x"],
                },
              },
              {
                name: "legendSelect",
                select: { type: "point", fields: [selectedMetric] },
                bind: "legend",
              },
            ],
            mark: { type: "line", strokeWidth: 3, interpolate: "monotone", clip: true },
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
                scale: { domainMin: 0.075 }, // hides 0 values from the graph
              },
              color: {
                field: selectedMetric,
                type: "nominal",
              },
              opacity: {
                condition: { param: "legendSelect", value: 1 },
                value: 0.2,
              },
            },
          },
          {
            data: {
              values: [{ date: startDate }, { date: endDate }],
            },

            mark: { type: "rule", strokeDash: [4, 3], strokeWidth: 2, color: "grey" },
            encoding: {
              x: { field: "date", type: "temporal" },
            },
            config: {
              veiw: { fill: "pink" },
            },
          },
        ],
      },
      {
        params: [
          {
            name: "legendSelect",
            select: { type: "point", fields: [selectedMetric] },
            bind: "legend",
          },
        ],
        width: "container",
        title: `${selectedMetric} Total Between ${new Date(startDate).toLocaleDateString("en-GB", {
          month: "short",
          year: "numeric",
        })} and ${new Date(endDate).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}`,
        mark: "bar",
        encoding: {
          x: { field: selectedMetric, type: "ordinal", axis: { title: "", labelAngle: 0 } },
          y: { field: "count", type: "quantitative", axis: { title: "" } },
          tooltip: { field: "count", type: "quantitative" },
          color: {
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
