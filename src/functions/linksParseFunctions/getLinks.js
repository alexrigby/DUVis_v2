//gets TSV dataset, returns array of headings and array of data
export async function getLinks(url) {
  const matrix = await fetch(url)
    .then((res) => res.text())
    .then((data) =>
      data
        // .trim()
        .replace(/\r/g, "")
        .split("\n")
        .map((row) => row.split("\t"))
    );

  return matrix;
}

export default getLinks;
