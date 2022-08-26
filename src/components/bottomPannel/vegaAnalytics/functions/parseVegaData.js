export function parseVegaData(actData, dates, brushRange) {
  //handles dates "onGoing" and "undefined"
  const numericDate = actData.map((act) => ({
    ...act,
    startDate: handleNonDates(act.startDate, "start"),
    endDate: handleNonDates(act.endDate, "end"),
  }));

  //unique category names
  const categorys = [...new Set(numericDate.map((act) => act["Activity Category"]))];

  //get groups of each activities in category
  const activityByCategory = categorys.map((category) =>
    numericDate.filter((act) => act["Activity Category"] === category)
  );

  const betweenBrushDates = numericDate.filter(
    (act) => brushRange.start <= new Date(act.startDate) && brushRange.end >= new Date(act.endDate)
  );
  //returns total activities per categor
  const barData = categorys.map((category) => ({
    category: category,
    count: betweenBrushDates.filter((act) => act["Activity Category"] === category).length,
  }));

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

  //combines both plot data to use concat on vega veiws
  const vegaData = { vegaData: [...plotData, ...barData] };

  // setVegaData(() => ({ data: vegaData, fields: categorys });
  return { vegaData: vegaData, categorys: categorys };
}

export default parseVegaData;

function handleNonDates(date, startOrEnd) {
  if (date === "onGoing" || date === "undefined") {
    return startOrEnd === "start" ? "2016-09-01" : "2023-02-01";
  } else {
    return date;
  }
}
