import { wpFields } from "../../data";

export function makeWpEdges(wpData) {
  const wpEdges = [];

  for (let i = 0; i < wpData.length - 1; i++) {
    for (let j = i + 1; j < wpData.length; j++) {
      wpEdges.push({
        group: "edges",
        classes: "wpEdge",
        data: {
          id: `${wpData[i][wpFields.ID]}${wpData[j][wpFields.ID]}`,
          source: `${wpData[i][wpFields.ID]}`,
          target: `${wpData[j][wpFields.ID]}`,
          type: "wpEdge",
        },
      });
    }
  }
  //   console.log(wpEdges.length);s

  return wpEdges;
}

export default makeWpEdges;
