export function makeStakeholderEdges(stakeholders) {
  return stakeholders.map((el, i) => {
    let linkedActivities = stakeholders[i].act.map((act) => act);

    //maps each link in i links to its array index (i + 1)
    return [
      //map linked activites (n)
      ...linkedActivities
        .map((n) => {
          return {
            group: "edges",
            data: {
              id: `g${el.id}e${n.actID}`,
              source: `${el.id}`,
              target: `${n.actID}`,
              type: "stakeholderEdge",
              engagement: n.engagement,
            },
          };
        })
        // .filter((el) => !parentlessNodes.includes(el.data.target))
        // filter out edges with no value (Node has no 'Linked Activities' in dataset)
        .filter((e) => e.data.target !== "NaN")
        //filters out edges whos source and target are the same node
        .filter((el) => el.data.target !== el.data.source),
      // .filter((el) => !parentlessNodes.includes(el.data.target)),
    ];
  });
}

export default makeStakeholderEdges;
