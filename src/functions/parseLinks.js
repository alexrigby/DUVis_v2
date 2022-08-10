import getLinks from "./linksParseFunctions/getLinks";
import linksMatrixToArray from "./linksParseFunctions/linksMatrixToArray";

export async function parseLinks(url) {
  const linksMatrix = await getLinks(url);
  const linksArray = linksMatrixToArray(linksMatrix);
  return linksArray;
}

export default parseLinks;
