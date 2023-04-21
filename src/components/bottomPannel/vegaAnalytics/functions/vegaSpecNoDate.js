export function vegaSpecNoDate(options, selectedMetric) {
  const spec = {
    padding: 20,
    data: { name: "vegaData" },
    tooltip: true,
    title: `${selectedMetric}`,
    width: "container",

    params: [
      {
        name: "legendSelect",
        select: { type: "point", fields: [selectedMetric] },
        bind: "legend",
      },
    ],

    mark: "bar",
    encoding: {
      x: { field: selectedMetric, type: "nominal", axis: { title: "", labelAngle: 0 } },
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

    config: {
      view: { stroke: null },
      legend: {
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

export default vegaSpecNoDate;
