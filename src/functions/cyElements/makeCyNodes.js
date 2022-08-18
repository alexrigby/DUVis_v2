//creats a Node object for each activity
export function makeCyNodes(data, dates) {
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
