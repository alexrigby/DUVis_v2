//creats a Node object for each activity
export function makeCyNodes(data) {
  const cyNodes = [];
  for (let i = 0; i < data.length; i++) {
    const nodeOps = {
      // group: "nodes",
      // classes: "activity",
      data: {
        // type: "act",
        // size: 1,
        // color: "rgba(0,0,0,.2)",
        //WP is set as node 'parent'
        // parent: `wp${data[i].WP}`,
        //ID is set as node 'id'
        id: data[i].ID,
        label: "node",
        // name: data[i].ActivityName,
        // category: data[i].ActivityCategory,
        // meta: {
        //   ...data[i],
        // },
      },
    };
    cyNodes.push(nodeOps);
  }
  return cyNodes;
}

export default makeCyNodes;
