export function linksMatrixToArray(linksArray) {
  //remove first row (ID) and first and "ID" to get ids of the collumns
  const collumnIds = linksArray.shift().slice(1);

  // remove first collumn (ID) and gets the ids of the rows
  var rowIds = [];
  for (let i = 0; i < linksArray.length; i++) {
    rowIds.push(linksArray[i].shift());
  }

  const allLinks = [];
  for (let i = 0; i < linksArray.length; i++) {
    var links = {
      act: Number(rowIds[i]),
      links: [],
    };
    // if there is an entry relating 2 ids then the id is pushed to links object
    for (let j = 0; j < linksArray[i].length; j++) {
      if (linksArray[i][j] !== "") {
        links.links.push(Number(collumnIds[j]));
      }
    }

    allLinks.push(links);
  }

  //object containing id, and array of ids that it is linked to
  return allLinks;
}

export default linksMatrixToArray;
