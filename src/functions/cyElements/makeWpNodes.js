import { wpFields } from "../../data";
//for each work package a node is created, each WP is a parent to one of the activities
export function makeWpNodes(data) {
  const wps = [];

  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      group: "nodes",
      classes: "wpNodes",
      data: {
        parent: "project",
        id: data[i][wpFields.ID],
        label: data[i][wpFields.ID].charAt(data[i][wpFields.ID].length - 1),
        type: "wp",
        name: data[i][wpFields.NAME],
        // SDGs: data[i][wpFields.SDGs],
        meta: {
          ...data[i],
        },
      },
    };
    wps.push(nodeOps);
  }

  return wps;
}

export default makeWpNodes;
