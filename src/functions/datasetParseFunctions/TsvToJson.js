//turns array of headings and data to JSON object
export function tsvToJson(d, keys) {
  const JSON = [];
  for (var i = 0; i < d.length; i++) {
    var data = {};
    for (var j = 0; j < keys.length; j++) {
      data[keys[j]] = d[i][j];
    }
    JSON.push(data);
  }
  return JSON;
}

export default tsvToJson;
