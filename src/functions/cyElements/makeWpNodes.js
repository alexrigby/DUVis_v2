import { wpFields } from "../../data";
//for each work package a node is created, each WP is a parent to one of the activities
export function makeWpNodes(data) {
  const wps = [
    // { group: "nodes", classes: "wpNodes", data: { id: "stakeholders", type: "wp", name: "All Stakeholders" } },
  ];
  // console.log(data);

  for (let i = 0; i < data.length; i++) {
    let wp = data[i][wpFields.ID];
    // var SDGs = []
    // for (let j = 0; j < 17; j++){

    // }
    const nodeOps = {
      group: "nodes",
      classes: "wpNodes",
      data: {
        parent: "project",
        id: wp,
        label: wp,
        type: "wp",
        name: data[i][wpFields.NAME],
        category: data[i][wpFields.CATEGORY],
        SDGs: data[i][wpFields.SDGs],
      },
    };
    wps.push(nodeOps);
  }
  return wps;
}

export default makeWpNodes;
