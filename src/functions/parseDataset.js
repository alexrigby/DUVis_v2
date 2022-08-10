import getTsvData from "./datasetParseFunctions/getTsvData";
import tsvToJson from "./datasetParseFunctions/TsvToJson";

export async function parseDataset(url) {
  const { dataset, headers } = await getTsvData(url);
  const data = tsvToJson(dataset, headers);
  return data;
}

export default parseDataset;
