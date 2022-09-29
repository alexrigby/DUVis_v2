import { metaFields } from "../../../../configs/metaFields";
export function uniqeMonths(data) {
  const o = data.sort((a, b) => a[metaFields.ENDM] - b[metaFields.STARTM]);
  const m = [];
  for (let i = 0; i < o.length; i++) {
    m.push(o[i][metaFields.STARTM]);
  }

  return [...new Set(m)];
}

export default uniqeMonths;
