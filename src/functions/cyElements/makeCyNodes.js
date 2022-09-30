//creats a Node object for each activity

import activityOpacity from "../activityOpacity";
import { actFields } from "../../data";

export function makeCyNodes(data, prPeriod, completedDisplay, latestPrPeriod) {
  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      group: "nodes",
      // classes: "activity",
      data: {
        type: "activityNode",
        size: 1,
        parent: `wp${data[i][actFields.WP]}`,
        id: data[i][actFields.ID],
        // flag: data[i].ID + `*`, //so I can style flagged data
        label: "node",
        name: data[i][actFields.ACTIVITY],
        category: data[i][actFields.CATEGORY],
        opacity: activityOpacity(data[i], completedDisplay, latestPrPeriod, prPeriod),
        meta: {
          ...data[i],
        },
      },
    };
    cyNodes.push(nodeOps);
  }

  return cyNodes;
}

export default makeCyNodes;

// function
