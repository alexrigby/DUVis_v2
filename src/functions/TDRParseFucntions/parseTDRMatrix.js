import getLinks from "../linksParseFunctions/getLinks";

export async function parseTDRMatrix(url) {
  const data = await getLinks(url);
  const stakeholders = data.slice(4, data.length - 1).map((sh) => sh.slice(0, 2)); // removes headers and gets 2 first collumns, tdr id and stakeholder name
  const stakeholderIDs = stakeholders.flatMap((s) => s.slice(0, 1)); // gets array of stakeholder IDs
  console.log(data);
  const activityIDs = data.slice(3, 4);
  console.log(activityIDs);
}

export default parseTDRMatrix;
