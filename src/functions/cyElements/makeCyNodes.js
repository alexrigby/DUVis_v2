//creats a Node object for each activity

import activityOpacity from "../activityOpacity";
import { metaFields } from "../../configs/metaFields";

export function makeCyNodes(data, prPeriod, completedDisplay, latestPrPeriod) {
  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      group: "nodes",
      // classes: "activity",
      data: {
        type: "activityNode",
        size: 1,
        parent: `wp${data[i][metaFields.WP]}`,
        id: data[i][metaFields.ID],
        // flag: data[i].ID + `*`, //so I can style flagged data
        label: "node",
        name: data[i][metaFields.ACTIVITY],
        category: data[i][metaFields.CATEGORY],
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
