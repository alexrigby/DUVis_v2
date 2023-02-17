export function makeActEdges(links, nodes) {
  //creats array of node in selection
  const nodeId = nodes.map((node) => parseFloat(node.data.id));
  //extractso only the link data for present nodes
  const removeActivity = links.filter((l) => nodeId.includes(l.act));
  //extracts the link data within each node
  const currentLinks = removeActivity.map((link) => ({
    act: link.act,
    links: nodeId.filter((id) => link.links.includes(id)),
  }));
  // console.log(currentLinks);
  return currentLinks.map((el, i) => {
    let linkedActivities = currentLinks[i].links;
    //maps each link in i links to its array index (i + 1)
    return [
      //map linked activites (n)
      ...linkedActivities
        .map((n) => ({
          group: "edges",
          data: {
            id: `g${el.act}e${n}`,
            source: `${el.act}`,
            target: `${n}`,
            type: "activityEdge",
          },
        }))
        // filter out edges with no value (Node has no 'Linked Activities' in dataset)
        .filter((e) => e.data.target !== "NaN")
        //filters out edges whos source and target are the same node
        .filter((el) => el.data.target !== el.data.source),
    ];
  });
}

export default makeActEdges;

function getCrossover(array1, array2) {
  return array1.filter((element) => array2.includes(element));
}
