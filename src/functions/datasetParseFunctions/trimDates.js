export function trimDates(dates) {
  //makes sure to only nclude dates that are before todays date
  const trimmedDates = dates.filter((d) => new Date(d.date).getTime() <= new Date().getTime());
  return trimmedDates;
}

export default trimDates;
