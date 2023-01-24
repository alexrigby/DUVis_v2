export function linksMatrixToArray(dataset) {
  // var copyDataset = [...dataset]
  //deletes header collumns
  for (let i = 0; i < dataset.length; i++) {
    dataset[i].splice(0, 3);
  }

  //array of ids (incase not in order or some missing)
  const datasetIds = dataset.slice(0, 1).flat();
  //deletes header rows
  dataset.splice(0, 3);

  const allLinks = [];
  //returns index (+1) of all instances of 'Y' i.e. IDs of linked activities
  for (let i = 0; i < dataset.length; i++) {
    var links = [];
    for (let j = 0; j < dataset[i].length; j++) {
      if (dataset[i][j] === "Y" || dataset[i][j] === "y" || dataset[i][j] === "1") {
        links.push(Number(datasetIds[j]));
      }
    }

    allLinks.push(links.flat());
  }

  return allLinks.map((link, i) => ({
    act: Number(datasetIds[i]),
    links: link,
  }));
}

export default linksMatrixToArray;
