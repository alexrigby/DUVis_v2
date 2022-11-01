import getLinks from "../linksParseFunctions/getLinks";

export async function parseTDRMatrix(url) {
  const data = await getLinks(url);
  const stakeholders = data.slice(4, data.length).map((s) => s.slice(0, 2)); // removes headers and gets 2 first collumns, tdr id and stakeholder name
  const activityIDs = data
    .slice(3, 4)
    .flat()
    .slice(2, data.length - 1);

  const matrix = data.slice(4, data.length).map((s) => s.slice(2, data.length));

  // const allShLinks = [];
  // //returns index (+1) of all instances of 'Y' i.e. IDs of linked activities
  // for (let i = 0; i < matrix.length; i++) {
  //   var shLinks = [];
  //   for (let j = 0; j < matrix[i].length; j++) {
  //     if (matrix[i][j] === "1" || matrix[i][j] === "2" || matrix[i][j] === "3" || matrix[i][j] === "4") {
  //       shLinks.push([matrix[i][j], activityIDs[j]]);
  //     }
  //   }
  //   allShLinks.push(shLinks);
  // }

  const stakeholderLinks = matrix.map((row, i) => ({
    stakeholderID: stakeholders[i][0],
    name: stakeholders[i][1],
    act: row
      .map(
        (el, j) =>
          (el === "1" || el === "2" || el === "3" || el === "4") && {
            actID: activityIDs[j],
            engagement: el,
          }
      )
      .filter((row) => row !== false),
  }));

  return stakeholderLinks;
}

export default parseTDRMatrix;
