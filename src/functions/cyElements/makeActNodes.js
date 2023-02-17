//creats a Node object for each activity

import { actFields } from "../../data";

export function makeActNodes(data) {
  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      group: "nodes",
      data: {
        type: "activityNode",
        size: 1,
        parent: `wp${data[i][actFields.WP]}`,
        colorRef: `wp${data[i][actFields.WP]}`,
        id: data[i][actFields.ID],
        // flag: data[i].ID + `*`, //so I can style flagged data
        label: data[i][actFields.ID],
        name: data[i][actFields.ACTIVITY],
        category: data[i][actFields.CATEGORY],
        meta: {
          ...data[i],
        },
      },
    };
    cyNodes.push(nodeOps);
  }
  return cyNodes;
}

export default makeActNodes;
