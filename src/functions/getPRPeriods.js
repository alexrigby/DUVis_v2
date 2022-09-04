export function getPRPeriods(dates) {
  const d = [...dates];

  const prPeriod = [];
  const chunkLength = [];
  const chunkSize = 6;

  for (let i = 0; i < d.length; i += chunkSize) {
    const chunk = d.slice(i, i + chunkSize);
    chunkLength.push(chunk);
  }

  for (let i = 0; i < chunkLength.length; i++) {
    for (let j = 0; j < chunkLength[i].length; j++) {
      chunkLength[i][j].prPeriod = i + 1;
    }
    prPeriod.push(chunkLength[i]);
  }

  return prPeriod.flat();
}

export default getPRPeriods;
