export function uniqeMonths(data) {
  const o = data.sort((a, b) => a["Start Month"] - b["Start Month"]);
  const m = [];
  for (let i = 0; i < o.length; i++) {
    m.push(o[i]["Start Month"]);
  }

  return [...new Set(m)];
}

export default uniqeMonths;
