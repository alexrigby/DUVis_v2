//for each work package a node is created, each WP is a parent to one of the activities
export function makeCyWpNodes(data) {
  const wps = [];

  for (let i = 0; i < data.length; i++) {
    let wp = data[i].id;

    const nodeOps = {
      group: "nodes",
      classes: "wpNodes",
      data: {
        id: wp,
        type: "wp",
        // size: WP_IDS[wp].length,
        name: data[i].name,
        category: data[i].category,
      },
    };
    wps.push(nodeOps);
  }
  return wps;
}

export default makeCyWpNodes;
