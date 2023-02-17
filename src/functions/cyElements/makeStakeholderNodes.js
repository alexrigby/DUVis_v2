export function makeStakeholerNodes(stakeholders) {
  return stakeholders.map((s) => {
    // const stakeholderRanking = s.act.map((a) => Number(a.engagement)).reduce((a, b) => a + b);
    return {
      group: "nodes",
      data: {
        colorRef: "stakeholder",
        type: "stakeholderNode",
        size: 1,
        sector: s.sector,
        category: s.category,
        id: s.stakeholderID,
        label: s.stakeholderID,
        name: s.name,
        weight: s.engagementRanking,
        //   parent: "stakeholders",
      },
    };
  });
}

export default makeStakeholerNodes;
