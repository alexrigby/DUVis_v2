export function makeDates(startDate, today) {
  // largley taken from stackOverflow: Rob M. 's answer here https://stackoverflow.com/questions/30464628/javascript-get-all-months-between-two-dates
  const start = startDate.split("-");
  const end = today.split("-");
  const startYear = parseInt(start[0]);
  const endYear = parseInt(end[0]);
  const months = [];

  for (var i = startYear; i <= endYear; i++) {
    // If the end year then return the end Month, return 11 (index) for years inbetween
    var endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
    var startMonth = i === startYear ? parseInt(start[1]) - 1 : 0;

    for (var j = startMonth; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      var month = j + 1;
      var displayMonth = month < 10 ? "0" + month : month;
      months.push([i, displayMonth, "01"].join("-"));
    }
  }

  var progressReport = 0;
  const dateObj = months.map((m, i) => {
    //every 6 months increas progress report period by 1
    i % 6 === 0 && progressReport++;
    return {
      date: m,
      month: String(i + 1),
      prPeriod: progressReport,
    };
  });

  return dateObj;
}

export default makeDates;
