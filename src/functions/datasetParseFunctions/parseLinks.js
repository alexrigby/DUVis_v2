import getLinks from "./getLinks";
import linksMatrixToArray from "./linksMatrixToArray";

export async function parseLinks(url) {
  // const linksMatrix = await getLinks(url);
  const linksArray = linksMatrixToArray(url);
  return linksArray;
}

export default parseLinks;
