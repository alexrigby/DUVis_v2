export function makeCyEdges(links) {
  return links.map((el, i) => {
    let linkedActivities = links[i];
    //maps each link in i links to its array index (i + 1)
    return [
      //map linked activites (n)
      ...linkedActivities
        .map((n) => ({
          group: "edges",
          data: {
            id: `g${i + 1}e${n}`,
            source: `${i + 1}`,
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

export default makeCyEdges;
