export function parseVegaData(actData, dates, brushRange, selectedMetric, options, categoryArray) {
  var actDataset = [...actData];

  // updates actData object so any blanks in selected vegafeilds are chnaged to create an "undefined" category
  for (var i = 0; i < actDataset.length; i++) {
    for (var j = 0; j < categoryArray; j++) {
      if (actDataset[i][categoryArray[j]] === "") {
        console.log(actDataset[i]);
        actDataset[i][categoryArray[j]] = "undefined";
      }
    }
  }

  //get groups of each activities in category
  const activityByOption = options.map((ops) => actDataset.filter((act) => act[selectedMetric] === ops));

  //finds all activitys whos start or end date extends into the brush range
  const withinBrushRange = actDataset.filter(
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
  const optionPerDate = activityByOption.map((opAct) => {
    // console.log(opAct);
    return dates.map((date) => ({
      [opAct[0][selectedMetric]]: opAct.filter(
        (act) =>
          new Date(date.date).getTime() >= new Date(act.startDate).getTime() &&
          new Date(date.date).getTime() <= new Date(act.endDate).getTime()
      ).length,
      date: new Date(date.date).getTime(),
      // ...date,
    }));
  });

  //flatten array or arrays and merge based on date collumn
  let plotData = {};
  optionPerDate.flat().forEach((a) => (plotData[a.date] = { ...plotData[a.date], ...a }));
  plotData = Object.values(plotData);

  //combines both bar and line plot data to use concat on vega veiws
  return { vegaData: [...plotData, ...barData] };
}

export default parseVegaData;
