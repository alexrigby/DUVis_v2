export function parseVegaData(actData, dates) {
  //unique category names
  const categorys = [...new Set(actData.map((act) => act["Activity Category"]))];
  //get groups of each activities in category
  const activityByCategory = categorys.map((category) =>
    actData.filter((act) => act["Activity Category"] === category)
  );
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

  return { plotData: plotData, categorys: categorys };
}

export default parseVegaData;
