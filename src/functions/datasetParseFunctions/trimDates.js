export function trimDates(dates) {
  // only include 1 more year of activities
  const maxDate = "2024-01-01";
  const laterThanMaxDate = new Date().getTime() >= new Date(maxDate).getTime();
  //makes sure to only nclude dates that are before todays date
  const trimmedDates = dates.filter(
    (d) => new Date(laterThanMaxDate ? maxDate : d.date).getTime() <= new Date().getTime()
  );
  return trimmedDates;
}

export default trimDates;
