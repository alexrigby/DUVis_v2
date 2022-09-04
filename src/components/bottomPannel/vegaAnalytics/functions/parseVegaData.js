import vegaMetricFields from "../../../../configs/vegaMetricFields";

export function parseVegaData(actData, dates, brushRange, selectedMetric) {
  //handles dates "onGoing" and "undefined"
  var numericDate = actData.map((act) => ({
    ...act,
    startDate: handleNonDates(act.startDate, "start"),
    endDate: handleNonDates(act.endDate, "end"),
  }));

  // updates numeric date object so any blanks in vegafeilds are chnaged to "undefined"
  for (var i = 0; i < numericDate.length; i++) {
    for (var j = 0; j < vegaMetricFields.length; j++) {
      if (numericDate[i][vegaMetricFields[j]] === "") {
        numericDate[i][vegaMetricFields[j]] = "undefined";
      }
    }
  }

  //unique category names
  const options = [...new Set(numericDate.map((act) => act[selectedMetric]))];

  //get groups of each activities in category
  const activityByOption = options.map((ops) => numericDate.filter((act) => act[selectedMetric] === ops));

  //finds all activitys whos start or end date extends into the brush range
  const withinBrushRange = numericDate.filter(
    (act) =>
      (brushRange.start < new Date(act.startDate) || brushRange.start < new Date(act.endDate)) &&
      (brushRange.end > new Date(act.endDate) || brushRange.end > new Date(act.startDate))
  );

  //returns total activities per option for bar chart
  const barData = options.map((ops) => ({
    [selectedMetric]: ops,
    count: withinBrushRange.filter((act) => act[selectedMetric] === ops).length,
  }));

  //add option count per month to date array
  const optionPerDate = activityByOption.map((opAct) =>
    dates.map((date) => ({
      [opAct[0][selectedMetric]]: opAct.filter(
        (act) => new Date(date.date) >= new Date(act.startDate) && new Date(date.date) <= new Date(act.endDate)
      ).length,
      ...date,
    }))
  );

  //flatten array or arrays and merge based on date collumn
  let plotData = {};
  optionPerDate.flat().forEach((a) => (plotData[a.date] = { ...plotData[a.date], ...a }));
  plotData = Object.values(plotData);

  //combines both bar and line plot data to use concat on vega veiws
  const vegaData = { vegaData: [...plotData, ...barData] };

  return { vegaData: vegaData, options: options };
}

export default parseVegaData;

function handleNonDates(date, startOrEnd) {
  if (date === "onGoing" || date === "undefined") {
    return startOrEnd === "start" ? "2016-09-01" : "2023-02-01";
  } else {
    return date;
  }
}
