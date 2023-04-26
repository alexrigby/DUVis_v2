export function getTypeOptionsArray(data, type) {
  return data.filter((f) => f.type === type).map((f) => f.name);
}

export default getTypeOptionsArray;
