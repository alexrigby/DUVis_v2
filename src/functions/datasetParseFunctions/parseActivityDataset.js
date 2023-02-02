import getTsvData from "./getTsvData";
import tsvToJson from "./TsvToJson";

export async function parseActivityDataset(url) {
  const { dataset, headers } = await getTsvData(url);

  const data = tsvToJson(dataset, headers);

  // ------ USE TO ANNONYMISE THE TOOL ____________________
  //   const researchers = [...new Set(data.map((act) => act.Name))];

  //   const researcherID = researchers.map((r, i) => {
  //     return { name: r, ID: `Resercher ${i + 1}` };
  //   });

  //   const annonomusActData = data.map((act) => {
  //     const ID = researcherID.find((el) => el.name === act.Name);

  //     return { ...act, Name: ID.ID };
  //   });

  //   console.log(annonomusActData);

  return data;
}

export default parseActivityDataset;
