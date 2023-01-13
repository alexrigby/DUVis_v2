import getLinks from "../linksParseFunctions/getLinks";

export async function parseTDRMatrix(url, trimmedData) {
  const data = await getLinks(url);
  const stakeholders = data.slice(4, data.length).map((s) => s.slice(0, 2)); // removes headers and gets 2 first collumns, tdr id and stakeholder name
  const activityIDs = data.slice(3, 4).flat().slice(2, data.length);

  const trimmedDataIds = trimmedData.map((act) => act.ID);

  const matrix = data.slice(3, data.length).map((s) => s.slice(2, data.length));

  const removeIndexArray = []; //get array of indicies to remove from matrix
  for (let i = 0; i < activityIDs.length; i++) {
    !trimmedDataIds.includes(activityIDs[i]) && removeIndexArray.push(i);
  }

  const trimmedMatrix = [];
  //filter matrix by index
  for (let i = 0; i < matrix.length; i++) {
    trimmedMatrix.push(matrix[i].filter((val, i) => removeIndexArray.indexOf(i) == -1));
  }

  const newActIds = trimmedMatrix.slice(0, 1).flat();
  const newMatrix = trimmedMatrix.slice(1, matrix.length);

  const stakeholderLinks = newMatrix.map((row, i) => ({
    stakeholderID: stakeholders[i][0],
    name: stakeholders[i][1],
    engagementRanking: row.map((el) => Number(el)).reduce((a, b) => a + b),
    act: row
      .map(
        (el, j) =>
          (el === "1" || el === "2" || el === "3" || el === "4") && {
            actID: newActIds[j],
            engagement: el,
          }
      )
      .filter((row) => row !== false),
  }));

  //removes stakeholders with empty act array
  const trimedStakeholders = stakeholderLinks.filter((s) => s.act.length !== 0);

  return trimedStakeholders;
}
export default parseTDRMatrix;
