//gets TSV dataset, returns array of headings and array of data
export async function getTsvData(url) {
  const dataset = await fetch(url)
    .then((res) => res.text())
    .then((data) =>
      data
        .replace(/\r/g, "")
        .split("\n")
        .map((row) => row.split("\t").map((item) => item.trim().replace(/"|'/g, "")))
    );

  return { dataset: dataset.slice(1, dataset.length), headers: dataset[0] };
}

export default getTsvData;
