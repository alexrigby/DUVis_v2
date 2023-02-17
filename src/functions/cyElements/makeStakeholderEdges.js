export function makeStakeholderEdges(stakeholders) {
  //   console.log(stakeholders.map((s) => s.act.map((act) => act.actID)));
  //   console.log(stakeholders);

  return stakeholders.map((el, i) => {
    let linkedActivities = stakeholders[i].act.map((act) => act);

    //maps each link in i links to its array index (i + 1)
    return [
      //map linked activites (n)
      ...linkedActivities
        .map((n) => ({
          group: "edges",
          data: {
            id: `g${el.stakeholderID}e${n.actID}`,
            source: `${el.stakeholderID}`,
            target: `${n.actID}`,
            type: "stakeholderEdge",
            engagement: n.engagement,
          },
        }))
        // filter out edges with no value (Node has no 'Linked Activities' in dataset)
        .filter((e) => e.data.target !== "NaN")
        //filters out edges whos source and target are the same node
        .filter((el) => el.data.target !== el.data.source),
    ];
  });
}

export default makeStakeholderEdges;
