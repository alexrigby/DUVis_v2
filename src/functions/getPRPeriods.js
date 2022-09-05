export function getPRPeriods(dates) {
  const prPeriod = [];
  const chunkLength = [];
  const chunkSize = 6;

  for (let i = 0; i < dates.length; i += chunkSize) {
    const chunk = dates.slice(i, i + chunkSize);
    chunkLength.push(chunk);
  }
  // console.log(chunkLength);
  for (let i = 0; i < chunkLength.length; i++) {
    for (let j = 0; j < chunkLength[i].length; j++) {
      chunkLength[i][j].prPeriod = i + 1;
    }
    prPeriod.push(chunkLength[i]);
  }

  return prPeriod.flat();
}

export default getPRPeriods;
