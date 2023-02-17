import getTsvData from "./getTsvData";
import tsvToJson from "./TsvToJson";

export async function parseWPDataset(url) {
  const { dataset, headers } = await getTsvData(url);
  const wpData = tsvToJson(dataset, headers);

  // adds list f SDGS to wpData object
  for (let i = 0; i < wpData.length; i++) {
    var SDGs = [];
    //there are 17 SDGs in total
    for (let j = 0; j < 17; j++) {
      wpData[i][`SDG_${j + 1}`] === "1" && SDGs.push(`SDG_${j + 1}`);
    }
    //add field to wpData and set it to the array of SDGs
    wpData[i].SDGs = SDGs;
  }

  return wpData;
}

export default parseWPDataset;
