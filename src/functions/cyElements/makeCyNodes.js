//creats a Node object for each activity
import statusOpacity from "../../configs/statusOpacity";

export function makeCyNodes(data, prPeriod) {
  function nodeOpacity(node) {
    if (prPeriod.pr === null) {
      return statusOpacity.onGoing;
    } else {
      if (node.endPrPeriod === "undefined" || node.endPrPeriod === "onGoing") {
        return statusOpacity.onGoing;
      } else {
        return node.endPrPeriod <= prPeriod.pr ? statusOpacity.completed : statusOpacity.onGoing;
      }
    }
  }

  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      group: "nodes",
      // classes: "activity",
      data: {
        type: "activityNode",
        size: 1,
        parent: `wp${data[i].WP}`,
        id: data[i].ID,
        label: "node",
        name: data[i]["Activity Name"],
        category: data[i]["Activity Category"],
        opacity: nodeOpacity(data[i]),
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
